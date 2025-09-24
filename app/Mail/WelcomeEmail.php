<?php
namespace App\Mail;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;  

class WelcomeEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $employee;

    public function __construct($employee)
    {
        $this->employee = $employee;
    }

    public function build()
    {
        return $this->subject('Welcome to the Secomus')
                    ->view('emails.welcome')
                    ->with(['employee' => $this->employee]);
    }
}