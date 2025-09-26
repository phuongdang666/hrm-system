<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Attendance;
use App\Models\Employee;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\DB;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Attendance::query()
            ->with(['employee.department'])
            ->when($request->filled('startDate'), function ($query) use ($request) {
                return $query->whereDate('date', '>=', $request->input('startDate'));
            })
            ->when($request->filled('endDate'), function ($query) use ($request) {
                return $query->whereDate('date', '<=', $request->input('endDate'));
            })
            ->when($request->filled('employeeId'), function ($query) use ($request) {
                return $query->where('employee_id', $request->input('employeeId'));
            })
            ->when($request->filled('departmentId'), function ($query) use ($request) {
                return $query->whereHas('employee.department', function ($query) use ($request) {
                    $query->where('id', $request->input('departmentId'));
                });
            });

        // Calculate total hours for the filtered period
        $totalHours = (float)$query->clone()
            ->sum(DB::raw('total_hours'));

        // Get records with calculated fields
        $records = $query->paginate(15)->map(function ($attendance) {
            return [
                'id' => $attendance->id,
                'employee_id' => $attendance->employee_id,
                'date' => $attendance->date,
                'check_in' => $attendance->check_in_at,
                'check_out' => $attendance->check_out_at,
                'total_hours' => (float)$attendance->total_hours,
                'status' => $attendance->status,
                'employee' => $attendance->employee ? [
                    'name' => $attendance->employee->name,
                    'department' => $attendance->employee->department
                        ? ['name' => $attendance->employee->department->name]
                        : null
                ] : null,
            ];
        });

        $startDate = $request->input('startDate', now()->toDateString());
        $endDate = $request->input('endDate', now()->toDateString());

        $employees = Employee::select('id', 'name')->orderBy('name')->get();
        $departments = \App\Models\Department::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Admin/Attendance', [
            'records' => $records,
            'totalHours' => $totalHours,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'filters' => $request->only(['employeeId', 'departmentId']),
            'employees' => $employees,
            'departments' => $departments,
        ]);
    }

    protected function calculateStatus($attendance)
    {
        // Define your company's working hours
        $workStartTime = '09:00:00';
        $workEndTime = '18:00:00';

        if (!$attendance->check_in_at) {
            return 'absent';
        }

        $checkInTime = Carbon::parse($attendance->check_in_at)->format('H:i:s');

        if ($checkInTime > $workStartTime) {
            return 'late';
        }

        if ($attendance->check_out_at) {
            $checkOutTime = Carbon::parse($attendance->check_out_at)->format('H:i:s');
            if ($checkOutTime < $workEndTime) {
                return 'early_leave';
            }
        }

        return 'present';
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
            'check_in' => 'required|date_format:H:i',
            'check_out' => 'nullable|date_format:H:i|after:check_in',
        ]);

        // Combine date with time
        $checkIn = Carbon::parse($validated['date'])->setTimeFromTimeString($validated['check_in']);
        $checkOut = null;
        if (!empty($validated['check_out'])) {
            $checkOut = Carbon::parse($validated['date'])->setTimeFromTimeString($validated['check_out']);
        }

        $attendance = Attendance::create([
            'employee_id' => $validated['employee_id'],
            'date' => $validated['date'],
            'check_in' => $checkIn,
            'check_out' => $checkOut,
        ]);

        return redirect()->back()->with('success', 'Attendance record created successfully.');
    }

    public function update(Request $request, Attendance $attendance)
    {
        $validated = $request->validate([
            'check_in' => 'sometimes|required|date_format:H:i',
            'check_out' => 'nullable|date_format:H:i|after:check_in',
        ]);

        $updates = [];
        if (isset($validated['check_in'])) {
            $updates['check_in'] = Carbon::parse($attendance->date)->setTimeFromTimeString($validated['check_in']);
        }
        if (isset($validated['check_out'])) {
            $updates['check_out'] = Carbon::parse($attendance->date)->setTimeFromTimeString($validated['check_out']);
        }

        $attendance->update($updates);

        return redirect()->back()->with('success', 'Attendance record updated successfully.');
    }

    public function destroy(Attendance $attendance)
    {
        $attendance->delete();
        return redirect()->back()->with('success', 'Attendance record deleted successfully.');
    }
}
