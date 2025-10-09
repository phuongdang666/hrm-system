<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payroll;
use App\Models\Employee;
use Illuminate\Support\Facades\DB;

class PayrollsSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Payroll::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $employees = Employee::all();

        foreach ($employees as $employee) {
            // Create payrolls for the last 2 months
            for ($i = 0; $i < 2; $i++) {
                $month = now()->subMonths($i)->format('Y-m');

                Payroll::create([
                    'employee_id' => $employee->id,
                    'month' => $month,
                    'base_salary' => $employee->base_salary,
                    'total_worked_hours' => rand(160, 200),
                    'total_overtime_hours' => rand(0, 40),
                    'unpaid_leave_days' => rand(0, 3),
                    'net_salary' => $employee->base_salary,
                    'status' => 'paid',
                    'created_by' => 1,
                    'updated_by' => 1
                ]);
            }
        }
    }
}
