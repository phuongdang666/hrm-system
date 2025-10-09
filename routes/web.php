<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AdminLoginController;
use App\Http\Controllers\Auth\EmployeeLoginController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\AttendanceController;
use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\EmployeeController as AdminEmployeeController;
use App\Http\Controllers\Employee\ProfileController;
use App\Http\Controllers\Employee\LeaveRequestController;
use App\Http\Controllers\Admin\PayrollController;

Route::get('/', [AdminLoginController::class, 'showLoginForm'])->name('home');

Route::prefix('admin')->middleware('guest.admin')->group(function () {
    Route::get('/login', [AdminLoginController::class, 'showLoginForm'])->name('admin.login');
    Route::post('/login', [AdminLoginController::class, 'login']);
    Route::get('/signup', [AdminLoginController::class, 'showSignUpForm'])->name('admin.signup');
    Route::post('/signup', [AdminLoginController::class, 'signup']);
});

Route::prefix('employee')->middleware('guest.employee')->group(function () {
    Route::get('/login', [EmployeeLoginController::class, 'showLoginForm'])->name('employee.login');
    Route::post('/login', [EmployeeLoginController::class, 'login']);
    Route::get('/signup', [EmployeeLoginController::class, 'showSignUpForm'])->name('employee.signup');
    Route::post('/signup', [EmployeeLoginController::class, 'signup']);
});

Route::prefix('admin')->middleware(['auth.admin'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');

    Route::post('/logout', [AdminLoginController::class, 'logout'])->name('admin.logout');
});

// Admin resource routes

Route::prefix('admin')->middleware(['auth.admin'])->group(function () {
    Route::resource('employees', AdminEmployeeController::class)->names('admin.employees');

    // Department routes
    Route::resource('departments', DepartmentController::class)->names('admin.departments');
    Route::post('departments/{department}/employees', [DepartmentController::class, 'addEmployee'])
        ->name('admin.departments.add-employees');
    Route::delete('departments/{department}/employees/{employee}', [DepartmentController::class, 'removeEmployee'])
        ->name('admin.departments.remove-employee');

    // Attendance routes
    Route::resource('attendances', AttendanceController::class)->only(['index', 'update'])->names('admin.attendances');
    // Announcement routes
    Route::resource('announcements', AnnouncementController::class)->names('admin.announcements');
    // AJAX endpoints for announcements
    Route::post('announcements/send', [AnnouncementController::class, 'store'])->name('admin.announcements.send');
    Route::get('announcements/{announcement}/status', [AnnouncementController::class, 'status'])->name('admin.announcements.status');

    Route::get('payrolls', [PayrollController::class, 'index'])->name('admin.payrolls.index');
    Route::post('payrolls/generate', [PayrollController::class, 'generatePayrolls'])->name('admin.payrolls.generate');
    Route::get('payrolls/{payroll}', [PayrollController::class, 'show'])->name('admin.payrolls.show');
});


Route::prefix('employee')->middleware(['auth.employee'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'show'])->name('employee.profile');
    Route::post('/profile', [ProfileController::class, 'update'])->name('employee.profile.update');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('employee.profile.avatar.update');
    Route::post('logout', [EmployeeLoginController::class, 'logout'])->name('employee.logout');

    // Leave Request routes for staff
    Route::get('/leave-requests', [LeaveRequestController::class, 'index'])
        // ->middleware('role:staff')
        ->name('employee.leave-requests');
    Route::post('/leave-requests', [LeaveRequestController::class, 'store'])->middleware('role:staff')->name('employee.leave-requests.store');

    // Leave Request routes for manager
    Route::get('/leave-requests', [LeaveRequestController::class, 'index'])
        // ->middleware('role:manager')
        ->name('employee.leave-requests.manage');
    Route::patch('/leave-requests/{leaveRequest}/status', [LeaveRequestController::class, 'updateStatus'])->middleware('role:manager')->name('employee.leave-requests.update-status');
});



Route::fallback(function () {
    return "Page Not Found";
})->name('not-found');

require __DIR__ . '/auth.php';
