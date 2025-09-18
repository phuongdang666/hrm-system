<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Title;
use Illuminate\Support\Facades\DB;

class TitlesSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Title::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        Title::factory()->count(8)->create();
    }
}
