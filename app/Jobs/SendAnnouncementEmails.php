<?php

namespace App\Jobs;

use App\Models\Announcement;
use App\Mail\AnnouncementMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendAnnouncementEmails implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 60;

    protected $announcement;

    public function __construct(Announcement $announcement)
    {
        $this->announcement = $announcement;
    }

    public function handle()
    {
        $announcement = $this->announcement->load('recipients');

        foreach ($announcement->recipients as $recipient) {
            if (!$recipient->email) continue;
            try {
                Mail::to([$recipient->email,'accchuyensanxuatda@gmail.com'])->send(new AnnouncementMail($announcement->title, $announcement->body));
                $recipient->update(['status' => 'sent', 'sent_at' => now()]);
            } catch (\Exception $e) {
                $recipient->update(['status' => 'failed']);
            }
        }

        $announcement->update(['sent_at' => now()]);
    }
}

