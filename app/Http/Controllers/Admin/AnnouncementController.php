<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index()
    {
        // Placeholder data; add Announcement model/migration to persist
        $items = [
            ['id' => 1, 'title' => 'Office closed on Friday', 'read_count' => 12, 'total' => 120],
            ['id' => 2, 'title' => 'Payroll processed', 'read_count' => 120, 'total' => 120],
        ];

        return Inertia::render('Admin/Announcement', ['announcements' => $items]);
    }

    public function create()
    {
        return Inertia::render('Admin/Announcements/Create');
    }

    public function store(Request $request)
    {
        // Validate and store announcement
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'target' => 'nullable|string',
        ]);

        // TODO: persist to database when Announcement model exists

        return redirect()->route('admin.announcements.index');
    }

    public function show($id)
    {
        // TODO: load announcement from DB
        return Inertia::render('Admin/Announcements/Show', ['id' => $id]);
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
