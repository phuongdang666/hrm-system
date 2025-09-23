<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'body',
        'sender_id',
        'sent_at',
        'meta',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'meta' => 'array',
    ];

    public function recipients()
    {
        return $this->hasMany(AnnouncementRecipient::class);
    }

    public function sender()
    {
        return $this->belongsTo(Employee::class, 'sender_id');
    }
}
