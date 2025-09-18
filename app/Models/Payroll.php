<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payroll extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'employee_id',
        'month',
        'year',
        'gross',
        'net',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function items()
    {
        return $this->hasMany(PayrollItem::class);
    }
}
