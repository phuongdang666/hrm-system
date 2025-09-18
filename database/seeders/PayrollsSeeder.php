<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payroll;
use App\Models\PayrollItem;
use App\Models\Employee;
use Illuminate\Support\Facades\DB;

class PayrollsSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        PayrollItem::truncate();
        Payroll::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $employees = Employee::inRandomOrder()->take(20)->get();

        foreach ($employees as $employee) {
            $payroll = Payroll::factory()->create([
                'employee_id' => $employee->id,
                'month' => now()->month,
                'year' => now()->year,
            ]);

            // create a few payroll items
            PayrollItem::factory()->count(3)->create(['payroll_id' => $payroll->id]);
        }
    }
}
