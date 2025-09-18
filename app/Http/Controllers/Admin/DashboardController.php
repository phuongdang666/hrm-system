<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Employee;
use App\Models\Attendance;
use App\Models\LeaveRequest;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $totalEmployees = Employee::count();
        $newThisMonth = Employee::whereYear('created_at', now()->year)->whereMonth('created_at', now()->month)->count();
        $attendanceToday = Attendance::whereDate('date', now()->toDateString())->count();
        $pendingLeaves = LeaveRequest::where('status', 'pending')->count();

        // Placeholder announcements — replace with Announcement model when available
        $recentAnnouncements = [
            ['id' => 1, 'title' => 'Office closed on Friday', 'date' => now()->subDays(6)->toDateString()],
            ['id' => 2, 'title' => 'Payroll processed', 'date' => now()->startOfMonth()->toDateString()],
        ];

        return Inertia::render('Admin/Dashboard', [
            'totalEmployees' => $totalEmployees,
            'newThisMonth' => $newThisMonth,
            'attendanceToday' => $attendanceToday,
            'pendingLeaves' => $pendingLeaves,
            'recentAnnouncements' => $recentAnnouncements,
        ]);
    }
}
