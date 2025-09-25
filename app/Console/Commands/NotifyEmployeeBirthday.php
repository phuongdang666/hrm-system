<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Employee;
use Illuminate\Support\Facades\Mail;
use App\Mail\BirthdayGreetingMail;
use Carbon\Carbon;

class NotifyEmployeeBirthday extends Command
{
    /**
     * Tên command (signature).
     *
     * Gọi: php artisan notify:employee-birthday
     */
    protected $signature = 'notify:employee-birthday';

    /**
     * Mô tả command.
     */
    protected $description = 'Gửi thông báo sinh nhật nhân viên hàng ngày';

    /**
     * Logic chính khi chạy command.
     */
    public function handle(): int
    {
        $this->info('🎉 Kiểm tra sinh nhật nhân viên hôm nay và gửi thông báo...');
        $today = Carbon::today()->format('m-d');

        // Lấy danh sách nhân viên có sinh nhật hôm nay
        $employees = Employee::whereRaw("DATE_FORMAT(birth_date, '%m-%d') = ?", [$today])->get();

        if ($employees->isEmpty()) {
            $this->info('Không có nhân viên nào sinh nhật hôm nay.');
            return Command::SUCCESS;
        }

        foreach ($employees as $employee) {
            // Gửi email chúc mừng cho nhân viên
            Mail::to($employee->email)->queue(new BirthdayGreetingMail($employee));

            // Ngoài ra có thể gửi thông báo cho HR
            Mail::to('accchuyensanxuatda@gmail.com')->queue(new BirthdayGreetingMail($employee, true));
        }

        $this->info('Thông báo sinh nhật đã được gửi.');
        return Command::SUCCESS;
    }
}
