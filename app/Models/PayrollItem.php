<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PayrollItem extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'payroll_id',
        'type',
        'amount',
    ];

    public function payroll()
    {
        return $this->belongsTo(Payroll::class);
    }
}
