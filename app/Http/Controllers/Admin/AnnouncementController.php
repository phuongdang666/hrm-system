<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Announcement;
use App\Models\AnnouncementRecipient;
use App\Models\Employee;
use App\Models\Department;
use App\Models\Title;
use App\Jobs\SendAnnouncementEmails;
use App\Http\Requests\Admin\AnnouncementRequest;

class AnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::withCount(['recipients as read_count' => function ($q) {
            $q->whereNotNull('read_at');
        }, 'recipients as total_recipients'])->orderBy('created_at', 'desc')->get();

        $departments = Department::select('id', 'name')->orderBy('name')->get();
        $titles = Title::select('id', 'name')->orderBy('name')->get();
        $employees = Employee::select('id', 'name', 'email')->orderBy('name')->get();

        return Inertia::render('Admin/Announcement', [
            'announcements' => $announcements,
            'departments' => $departments,
            'titles' => $titles,
            'employees' => $employees,
        ]);
    }

    public function create()
    {
        $departments = Department::select('id', 'name')->orderBy('name')->get();
        $titles = Title::select('id', 'name')->orderBy('name')->get();
        $employees = Employee::select('id', 'name', 'email')->orderBy('name')->get();

        return Inertia::render('Admin/Announcements/Create', compact('departments', 'titles', 'employees'));
    }

    public function store(AnnouncementRequest $request)
    {
        // Validate and store announcement
        $validated = $request->validated();

        $announcement = Announcement::create([
            'title' => $validated['title'],
            'body' => $validated['body'],
            // sender mapping: admin guard isn't tied to Employee model in this app by default
            'sender_id' => null,
        ]);

        $recipientEmployees = collect($validated['employees'] ?? []);

        // expand departments -> employees
        if (!empty($validated['departments'])) {
            $deptEmployees = Employee::whereIn('department_id', $validated['departments'])->pluck('id');
            $recipientEmployees = $recipientEmployees->merge($deptEmployees);
        }

        // expand titles -> employees
        if (!empty($validated['titles'])) {
            $titleEmployees = Employee::whereIn('title_id', $validated['titles'])->pluck('id');
            $recipientEmployees = $recipientEmployees->merge($titleEmployees);
        }

        $recipientEmployees = $recipientEmployees->unique()->values();

        // If there are no recipients, return validation error for AJAX requests
        if ($recipientEmployees->count() === 0) {
            if ($request->expectsJson()) {
                return response()->json(['errors' => ['recipients' => ['Please choose at least one recipient (employee, department, or title).']]], 422);
            }

            return redirect()->back()->withErrors(['recipients' => 'Please choose at least one recipient (employee, department, or title).'])->withInput();
        }

        foreach ($recipientEmployees as $empId) {
            $emp = Employee::find($empId);
            AnnouncementRecipient::create([
                'announcement_id' => $announcement->id,
                'employee_id' => $empId,
                'email' => $emp->email ?? null,
                'status' => 'pending',
            ]);
        }

        // dispatch job to send emails (queued)
        SendAnnouncementEmails::dispatch($announcement);

        if ($request->expectsJson()) {
            return response()->json(['id' => $announcement->id], 201);
        }

        return redirect()->route('admin.announcements.index')->with('success', 'Announcement queued for delivery.');
    }

    // public function status($id)
    // {
    //     $announcement = Announcement::withCount(['recipients as sent_count' => function ($q) {
    //         $q->where('status', 'sent');
    //     }, 'recipients as failed_count' => function ($q) {
    //         $q->where('status', 'failed');
    //     }, 'recipients as pending_count' => function ($q) {
    //         $q->where('status', 'pending');
    //     }])->withCount('recipients as total_recipients')->findOrFail($id);

    //     return response()->json([
    //         'id' => $announcement->id,
    //         'total' => $announcement->total_recipients,
    //         'sent' => $announcement->sent_count,
    //         'failed' => $announcement->failed_count,
    //         'pending' => $announcement->pending_count,
    //     ]);
    // }

    public function show($id)
    {
        $announcement = Announcement::with('recipients.employee')->findOrFail($id);
        return Inertia::render('Admin/Announcements/Show', ['announcement' => $announcement]);
    }

    public function edit($id)
    {
        return Inertia::render('Admin/Announcements/Edit', ['id' => $id]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        // TODO: update in DB

        return redirect()->route('admin.announcements.index');
    }

    public function destroy($id)
    {
        // TODO: delete from DB
        return redirect()->route('admin.announcements.index');
    }
}
