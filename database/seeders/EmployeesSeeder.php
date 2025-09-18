<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use App\Models\Department;
use App\Models\Title;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class EmployeesSeeder extends Seeder
{
    public function run()
    {
        // Clear existing employees to avoid unique constraint collisions when re-running seeders
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Employee::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Ensure some departments & titles exist
        $departments = Department::all();
        if ($departments->isEmpty()) {
            $departments = Department::factory()->count(4)->create();
        }

        $titles = Title::all();
        if ($titles->isEmpty()) {
            $titles = Title::factory()->count(6)->create();
        }

        // Create employees and assign random department/title
        Employee::factory()
            ->count(50)
            ->create()
            ->each(function ($employee) use ($departments, $titles) {
                $employee->department_id = $departments->random()->id;
                $employee->title_id = $titles->random()->id;
                $employee->password = Hash::make('password');
                $employee->save();
            });
    }
}
