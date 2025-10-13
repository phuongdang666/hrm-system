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

        // return LeaveRequest::whereBetween('start_date', [$start, $end])
        //     ->where('type', 'unpaid')
        //     ->where('status', 'approved')
        //     ->selectRaw('employee_id, SUM(days) as unpaid_days')
        //     ->groupBy('employee_id')
        //     ->get()
        //     ->keyBy('employee_id');
        return LeaveReques::where('type', 'unpaid')
            ->where('status', 'approved')
            ->where(function($query) use ($startOfMonth, $endOfMonth){
                //
                $query->whereBetween('start_date', [$startOfMonth, $endOfMonth])
                      ->orWhereBetween('end_date', [$startOfMonth, $endOfMonth])
                      ->orWhere (function($query1) use($startOfMonth, $endOfMonth){
                        $query1->where('start_date', '<', $startOfMonth )
                                ->orWhere('end_date', '>', $endOfMonth);    
                      });
            })
            ->select('employee_id')
            ->selectRaw('
                SUM(
                    DATEDIFF(
                        GREATEST(start_date,?)
                        LEAST(end_date,?) +1
                ) as unpaid_days
            ',[$startOfMonth, $endOfMonth])
            ->groupBy('employee_id')
            ->get()
            ->keyBy('employee_id');
    }
}
