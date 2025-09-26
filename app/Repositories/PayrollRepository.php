<?php
namespace App\Repositories;

use App\Models\Payroll;
use App\Repositories\Contracts\PayrollRepositoryInterface;

class PayrollRepository implements PayrollRepositoryInterface
{
    public function updateOrCreate(array $conditions, array $data)
    {
        return Payroll::updateOrCreate($conditions, $data);
    }
}
