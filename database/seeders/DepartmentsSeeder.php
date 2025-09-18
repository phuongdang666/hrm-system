<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;
use Illuminate\Support\Facades\DB;

class DepartmentsSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Department::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        Department::factory()->count(6)->create();
    }
}
