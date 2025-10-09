<?php
namespace App\Services;

use App\Mail\PayrollGenerated;
use App\Models\Employee;
use App\Repositories\Contracts\AttendanceRepositoryInterface;
use App\Repositories\Contracts\LeaveRequestRepositoryInterface;
use App\Repositories\Contracts\PayrollRepositoryInterface;
use Illuminate\Support\Facades\Mail;

class PayrollService
{
    const WORKING_HOURS_PER_MONTH = 160;
    const WORKING_HOURS_PER_DAY   = 8;
    const OT_MULTIPLIER           = 1.5;

    public function __construct(
        private AttendanceRepositoryInterface $attendanceRepo,
        private LeaveRequestRepositoryInterface $leaveRepo,
        private PayrollRepositoryInterface $payrollRepo
    ) {}

    public function generatePayrolls(string $month)
    {
        $employees     = Employee::all();
        $attendances   = $this->attendanceRepo->getMonthlyData($month);
        $leaveRequests = $this->leaveRepo->getMonthlyData($month);

        foreach ($employees as $employee) {
            $this->generate(
                $employee,
                $month,
                $attendances[$employee->id] ?? null,
                $leaveRequests[$employee->id] ?? null
            );
        }
    }

    private function generate(Employee $employee, string $month, $attendance = null, $leaveRequest = null)
    {
        $hourlyRate = $employee->base_salary / self::WORKING_HOURS_PER_MONTH;

        $workedHours = $attendance->worked_hours ?? 0;
        $otHours     = $attendance->ot_hours ?? 0;
        $unpaidDays  = $leaveRequest->unpaid_days ?? 0;

        $salary = ($workedHours * $hourlyRate)
                + ($otHours * $hourlyRate * self::OT_MULTIPLIER)
                - ($unpaidDays * self::WORKING_HOURS_PER_DAY * $hourlyRate);

        $payroll = $this->payrollRepo->updateOrCreate(
            ['employee_id' => $employee->id, 'month' => $month],
            [
                'base_salary'          => $employee->base_salary,
                'total_worked_hours'   => $workedHours,
                'total_overtime_hours' => $otHours,
                'unpaid_leave_days'    => $unpaidDays,
                'net_salary'           => round($salary, 2),
            ]
        );

        // Send email notification to employee
        Mail::to($employee->email)->queue(new PayrollGenerated($payroll));

        return $payroll;
    }
}

