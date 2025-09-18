<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Support\Facades\DB;

class AttendancesSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Attendance::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $employees = Employee::inRandomOrder()->take(15)->get();

        foreach ($employees as $employee) {
            // create attendances for the last 14 days
            for ($i = 0; $i < 14; $i++) {
                Attendance::factory()->create([
                    'employee_id' => $employee->id,
                    'date' => now()->subDays($i)->toDateString(),
                ]);
            }
        }
    }
}
