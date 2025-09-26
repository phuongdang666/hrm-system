<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Payroll;
use App\Services\PayrollService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PayrollController extends Controller
{
    protected $payrollService;

    public function __construct(PayrollService $payrollService)
    {
        $this->payrollService = $payrollService;
    }

    public function index(Request $request)
    {
        $month = $request->get('month', Carbon::now()->format('Y-m'));

        $payrolls = Payroll::with('employee')
            ->where('month', $month)
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(function ($payroll) {
                return [
                    'id' => $payroll->id,
                    'employee' => [
                        'id' => $payroll->employee->id,
                        'name' => $payroll->employee->name,
                    ],
                    'month' => $payroll->month,
                    'base_salary' => $payroll->base_salary,
                    'total_overtime_hours' => $payroll->total_overtime_hours,
                    'unpaid_leave_days' => $payroll->unpaid_leave_days,
                    'net_salary' => $payroll->net_salary,                
                ];
            });


        return Inertia::render('Admin/Payroll', [
            'payrolls' => $payrolls,
            'filters' => [
                'month' => $month,
            ],  
        ]);
    }

    public function generatePayrolls(Request $request)
    {
        $request->validate([
            'month' => 'required|date_format:Y-m',
        ]);

        $month = $request->month;
        $employees = Employee::with('attendances')->get();

        foreach ($employees as $employee) {
            $this->payrollService->generate($employee, $month);
        }

        return back()->with('success', 'Payrolls generated successfully.');
    }

    public function show(Payroll $payroll)
    {
        $payroll->load('employee');

        return Inertia::render('Admin/PayrollDetail', [
            'payroll' => [
                'id' => $payroll->id,
                'employee' => [
                    'id' => $payroll->employee->id,
                    'name' => $payroll->employee->name,
                ],
                'month' => $payroll->month,
                'base_salary' => $payroll->base_salary,
                'total_worked_hours' => $payroll->total_worked_hours,
                'total_overtime_hours' => $payroll->total_overtime_hours,
                'unpaid_leave_days' => $payroll->unpaid_leave_days,
                'net_salary' => $payroll->net_salary,
                'created_at' => $payroll->created_at,
                'status' => $payroll->status,
            ],
        ]);
    }
}
