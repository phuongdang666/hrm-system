<?php
namespace App\Services;

use App\Models\Employee;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\Payroll;
use Carbon\Carbon;

class PayrollService
{
    const WORKING_HOURS_PER_MONTH = 160;
    const OT_MULTIPLIER = 1.5;

    public function generate(Employee $employee, string $month)
    {
        $start = Carbon::parse($month)->startOfMonth();
        $end   = Carbon::parse($month)->endOfMonth();

        $hourlyRate = $employee->base_salary / self::WORKING_HOURS_PER_MONTH;

        $workedHours = Attendance::where('employee_id', $employee->id)
            ->whereBetween('date', [$start, $end])
            ->sum('regular_hours');

        $otHours = Attendance::where('employee_id', $employee->id)
            ->whereBetween('date', [$start, $end])
            ->sum('overtime_hours');

        $unpaidDays = LeaveRequest::where('employee_id', $employee->id)
            ->whereBetween('start_date', [$start, $end])
            ->where('type', 'unpaid')
            ->where('status', 'approved')
            ->count();

        $salary = ($workedHours * $hourlyRate)
                + ($otHours * $hourlyRate * self::OT_MULTIPLIER)
                - ($unpaidDays * 8 * $hourlyRate);

        return Payroll::updateOrCreate(
            ['employee_id' => $employee->id, 'month' => $month],
            [
                'base_salary' => $employee->base_salary,
                'total_worked_hours' => $workedHours,
                'total_overtime_hours' => $otHours,
                'unpaid_leave_days' => $unpaidDays,
                'net_salary' => round($salary, 2),
                
            ]
        );
    }
}
