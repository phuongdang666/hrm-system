<?php
namespace App\Repositories;

use App\Models\LeaveRequest;
use App\Repositories\Contracts\LeaveRequestRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class LeaveRequestRepository implements LeaveRequestRepositoryInterface
{
    public function getMonthlyData(string $month): Collection
    {
        $start = Carbon::parse($month)->startOfMonth();
        $end   = Carbon::parse($month)->endOfMonth();

        return LeaveRequest::whereBetween('start_date', [$start, $end])
            ->where('type', 'unpaid')
            ->where('status', 'approved')
            ->selectRaw('employee_id, COUNT(*) as unpaid_days')
            ->groupBy('employee_id')
            ->get()
            ->keyBy('employee_id');
    }
}
