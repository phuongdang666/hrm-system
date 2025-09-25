<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Employee;

class BirthdayGreetingMail extends Mailable
{
    use Queueable, SerializesModels;

    public $employee;
    public $forHR;

    public function __construct(Employee $employee, $forHR = false)
    {
        $this->employee = $employee;
        $this->forHR = $forHR;
    }

    public function build()
    {
        if ($this->forHR) {
            return $this->subject("Hôm nay là sinh nhật của {$this->employee->name}")
                        ->markdown('emails.birthday.greeting', [
                            'message' => "Hôm nay là sinh nhật của {$this->employee->name}. HR vui lòng gửi lời chúc 🎉"
                        ]);
        }

        return $this->subject("Chúc mừng sinh nhật, {$this->employee->name}! 🎂")
                    ->markdown('emails.birthday.greeting', [
                        'message' => "Chúc bạn một sinh nhật thật vui vẻ và hạnh phúc 🎉"
                    ]);
    }
}
