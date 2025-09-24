<?php
namespace App\Listeners;
use App\Events\NewEmployee;
use App\Mail\WelcomeEmail;
use App\Models\Employee;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendWelcomeEmail implements ShouldQueue
{
    use InteractsWithQueue;

    public function __construct()
    {
        //
    }

    public function handle(NewEmployee $event)
    {
        $employee = Employee::find($event->employeeId);
        if ($employee && $employee->email) {
            Mail::to($employee->email)->queue(new WelcomeEmail($employee));
        }
    }
}