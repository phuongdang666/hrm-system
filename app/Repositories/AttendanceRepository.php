<?php
namespace App\Repositories;

use App\Models\Attendance;
use App\Repositories\Contracts\AttendanceRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class AttendanceRepository implements AttendanceRepositoryInterface
{
    public function getMonthlyData(string $month): Collection
    {
        $start = Carbon::parse($month)->startOfMonth();
        $end   = Carbon::parse($month)->endOfMonth();

        return Attendance::whereBetween('date', [$start, $end])
            ->selectRaw('employee_id, SUM(regular_hours) as worked_hours, SUM(overtime_hours) as ot_hours')
            ->groupBy('employee_id')
            ->get()
            ->keyBy('employee_id');
    }
}
