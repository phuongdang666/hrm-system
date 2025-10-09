<?php

namespace App\Mail;

use App\Models\LeaveRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LeaveRequestStatusUpdated extends Mailable implements \Illuminate\Contracts\Queue\ShouldQueue
{
    use Queueable, SerializesModels;

    public $leaveRequest;
    public $manager;

    public function __construct(LeaveRequest $leaveRequest, $manager)
    {
        $this->leaveRequest = $leaveRequest;
        $this->manager = $manager;
    }

    public function envelope(): Envelope
    {
        $status = ucfirst($this->leaveRequest->status);
        return new Envelope(
            subject: "Leave Request {$status}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.leave-requests.status-updated',
            with: [
                'leaveRequest' => $this->leaveRequest,
                'manager' => $this->manager,
                'url' => route('employee.leave-requests.manage'),
            ],
        );
    }
}