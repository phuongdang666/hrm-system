<?php

namespace App\Mail;

use App\Models\Payroll;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PayrollGenerated extends Mailable implements \Illuminate\Contracts\Queue\ShouldQueue
{
    use Queueable, SerializesModels;

    public $payroll;

    public function __construct(Payroll $payroll)
    {
        $this->payroll = $payroll;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Payroll Statement for ' . $this->payroll->month . '/' . $this->payroll->year,
        );
    }

    public function content(): Content
    {
        $totalAmount = number_format($this->payroll->basic_salary + $this->payroll->allowances + $this->payroll->overtime_pay - $this->payroll->deductions, 2);
        
        return new Content(
            markdown: 'emails.payrolls.generated',
            with: [
                'payroll' => $this->payroll,
                'employee' => $this->payroll->employee,
                'totalAmount' => $totalAmount,
                'month' => $this->payroll->month,
                'year' => $this->payroll->year,
            ],
        );
    }
}