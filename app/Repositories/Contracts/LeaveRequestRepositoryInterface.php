<?php 
namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface LeaveRequestRepositoryInterface
{
    public function getMonthlyData(string $month): Collection;
}