<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Attendance extends Model
{
    use HasFactory, SoftDeletes;

    // Day type constants
    public const DAY_TYPE_WEEKDAY = 'weekday';
    public const DAY_TYPE_WEEKEND = 'weekend';
    public const DAY_TYPE_HOLIDAY = 'holiday';

    public const DAY_TYPES = [
        self::DAY_TYPE_WEEKDAY,
        self::DAY_TYPE_WEEKEND,
        self::DAY_TYPE_HOLIDAY
    ];

    // Attendance status constants 
    public const STATUS_PRESENT = 'present';
    public const STATUS_ABSENT = 'absent';
    public const STATUS_LATE = 'late';
    public const STATUS_EARLY_LEAVE = 'early_leave';
    public const STATUS_HALF_DAY = 'half_day';
    public const STATUS_WORK_FROM_HOME = 'work_from_home';

    public const STATUSES = [
        self::STATUS_PRESENT,
        self::STATUS_ABSENT,
        self::STATUS_LATE,
        self::STATUS_EARLY_LEAVE,
        self::STATUS_HALF_DAY,
        self::STATUS_WORK_FROM_HOME
    ];

    protected $fillable = [
        'employee_id',
        'date',
        'check_in_at',
        'check_out_at',
        'regular_hours',
        'overtime_hours',
        'total_hours',
        'day_type',
        'status',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'date' => 'date',
        'check_in_at' => 'datetime',
        'check_out_at' => 'datetime',
        'regular_hours' => 'decimal:2',
        'overtime_hours' => 'decimal:2',
        'total_hours' => 'decimal:2',
        'day_type' => 'string',
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
