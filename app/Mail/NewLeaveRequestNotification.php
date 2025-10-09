<?php

namespace App\Mail;

use App\Models\LeaveRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class NewLeaveRequestNotification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $leaveRequest;

    public function __construct(LeaveRequest $leaveRequest)
    {
        $this->leaveRequest = $leaveRequest;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Leave Request from ' . $this->leaveRequest->employee->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.leave-requests.new-request',
            with: [
                'leaveRequest' => $this->leaveRequest,
                'url' => route('employee.leave-requests.manage'),
            ],
        );
    }
}