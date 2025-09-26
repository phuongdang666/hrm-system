<?php
namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface PayrollRepositoryInterface
{
    public function updateOrCreate(array $conditions, array $data);
}
