<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            DepartmentsSeeder::class,
            TitlesSeeder::class,
            EmployeesSeeder::class,
            AttendancesSeeder::class,
            PayrollsSeeder::class,
            LeaveRequestsSeeder::class,
        ]);
    }
}
