<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class Employee extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes,HasRoles;

    protected $fillable = [
        'code',
        'name',
        'email',
        'password',
        'phone',
        'address',
        'department_id',
        'title_id',
        'base_salary',
        'join_date',
        'birth_date',
        'contract_end_at',
        'status',
        'avatar',
        'meta',
        'role'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'base_salary' => 'decimal:2',
        'join_date' => 'date',
        'birth_date' => 'date',
        'contract_end_at' => 'date',
        'meta' => 'array',
        'deleted_at' => 'datetime',
    ];
    public function hasRole($role)
    {
        return $this->role === $role;
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function title()
    {
        return $this->belongsTo(Title::class);
    }

    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class);
    }
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
    public function payrolls()
    {
        return $this->hasMany(Payroll::class);
    }
}
