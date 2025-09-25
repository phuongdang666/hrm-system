<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Định nghĩa schedule cho toàn hệ thống.
     */
    protected function schedule(Schedule $schedule): void
    {
        $schedule->command('notify:employee-birthday')->everyMinute();
    }


    /**
     * Đăng ký các commands trong thư mục app/Console/Commands.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
