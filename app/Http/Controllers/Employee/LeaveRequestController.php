<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use App\Models\Employee;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Employee\LeaveRequest as LeaveRequestForm;
use App\Mail\NewLeaveRequestNotification;
use App\Mail\LeaveRequestStatusUpdated;
use Illuminate\Support\Facades\Mail;


class LeaveRequestController extends Controller
{
    public function index()
    {
        $employee = auth('employee')->user();

        if ($employee->role === 'manager') {
            // Get leave requests from staff in the same department
            $leaveRequests = LeaveRequest::whereHas('employee', function ($query) use ($employee) {
                $query->where('department_id', $employee->department_id)
                    ->where('role', 'staff')
                    ->orderByDesc('id');
            })->with('employee')->get();
        } else {
            // Get own leave requests
            $leaveRequests = $employee->leaveRequests;
        }

        return Inertia::render('Employee/LeaveRequest', [
            'leaveRequests' => $leaveRequests,
            'userRole' => $employee->role,
            'departmentMembers' => $employee->role === 'manager' ?
                Employee::where('department_id', $employee->department_id)
                ->where('role', 'staff')
                ->get() : []
        ]);
    }

    public function store(LeaveRequestForm $request)
    {
        $validated = $request->validated();
        $employee = auth('employee')->user();
        
        $leaveRequest = LeaveRequest::create([
            'employee_id'   => $employee->id,
            'department_id' => $employee->department_id,
            'type'          => $validated['type'],
            'start_date'    => $validated['start_date'],
            'end_date'      => $validated['end_date'],
            'days'          => (new \DateTime($validated['end_date']))->diff(new \DateTime($validated['start_date']))->days + 1,
            'reason'        => $validated['reason'],
            'status'        => 'pending',
        ]);

        // Get department manager's email
        $manager = Employee::where('department_id', $employee->department_id)
            ->where('role', 'manager')
            ->first();

        // Send email notification to manager if exists
        if ($manager && $manager->email) {
            try {
                Mail::to($manager->email)->queue(new NewLeaveRequestNotification($leaveRequest));
            } catch (\Exception $e) {
                // Log the error but don't stop the process
                \Log::error('Failed to send leave request notification email: ' . $e->getMessage());
            }
        }

        return redirect()->back()->with('success', 'Leave request submitted successfully.');
    }

    public function updateStatus(LeaveRequest $leaveRequest, Request $request)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        $manager = auth('employee')->user();

        // Verify manager is from same department as leave request employee
        if ($manager->role !== 'manager' || $manager->department_id !== $leaveRequest->employee->department_id) {
            return redirect()->back()->with('error', 'Unauthorized action.');
        }

        $leaveRequest->update([
            'status' => $validated['status'],
            'processed_by' => $manager->id,
        ]);

        // Send email notification to employee
        try {
            Mail::to($leaveRequest->employee->email)
                ->queue(new LeaveRequestStatusUpdated($leaveRequest->fresh()->load('employee'), $manager));
        } catch (\Exception $e) {
            \Log::error('Failed to send leave request status update email: ' . $e->getMessage());
        }

        return redirect()->back()->with('success', 'Leave request updated successfully.');
    }
}
