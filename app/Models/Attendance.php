<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Attendance extends Model
{
    use HasFactory;

    // Attendance status constants 
    public const STATUS_PRESENT = 'present';
    public const STATUS_ABSENT = 'absent';
    public const STATUS_LATE = 'late';
    public const STATUS_EARLY_LEAVE = 'early_leave';

    public const STATUSES = [
        self::STATUS_PRESENT,
        self::STATUS_ABSENT,
        self::STATUS_LATE,
        self::STATUS_EARLY_LEAVE,
    ];

    protected $fillable = [
        'employee_id',
        'date',
        'check_in_at',
        'check_out_at',
        'regular_hours',
        'overtime_hours',
        'total_hours',
        'status',

    ];

    protected $casts = [
        'date' => 'date',
        'check_in_at' => 'datetime:H:i',
        'check_out_at' => 'datetime:H:i',
        'regular_hours' => 'decimal:2',
        'overtime_hours' => 'decimal:2',
        'total_hours' => 'decimal:2',
        'status' => 'string'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function creator()
    {
        return $this->belongsTo(Employee::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(Employee::class, 'updated_by');
    }
}
