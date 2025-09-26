<?php
namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface AttendanceRepositoryInterface
{
    public function getMonthlyData(string $month): Collection;
}