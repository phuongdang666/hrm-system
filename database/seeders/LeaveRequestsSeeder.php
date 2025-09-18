<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LeaveRequest;
use App\Models\Employee;
use Illuminate\Support\Facades\DB;

class LeaveRequestsSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        LeaveRequest::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $employees = Employee::inRandomOrder()->take(15)->get();

        foreach ($employees as $employee) {
            LeaveRequest::factory()->count(2)->create(['employee_id' => $employee->id]);
        }
    }
}
