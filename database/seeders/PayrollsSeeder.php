<?php

// namespace Database\Seeders;

// use Illuminate\Database\Seeder;
// use App\Models\Payroll;
// use App\Models\PayrollItem;
// use App\Models\Employee;
// use Illuminate\Support\Facades\DB;

// class PayrollsSeeder extends Seeder
// {
//     public function run()
//     {
//         DB::statement('SET FOREIGN_KEY_CHECKS=0;');
//         PayrollItem::truncate();
//         Payroll::truncate();
//         DB::statement('SET FOREIGN_KEY_CHECKS=1;');

//         $employees = Employee::all();

//         foreach ($employees as $employee) {
//             // create payrolls for the last 2 months
//             for ($i = 0; $i < 2; $i++) {
//                 $month = now()->subMonths($i)->format('Y-m');

//                 Payroll::factory()->create([
//                     'employee_id' => $employee->id,
//                     'month' => $month,
//                 ]);
//             }
//         }
//     }
// }
