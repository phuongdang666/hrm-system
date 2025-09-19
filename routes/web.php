<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AdminLoginController;
use App\Http\Controllers\Auth\EmployeeLoginController;

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\AttendanceController;
use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\EmployeeController as AdminEmployeeController;

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
    Route::resource('departments', DepartmentController::class)->names('admin.departments');
    Route::get('attendances', [AttendanceController::class, 'index'])->name('admin.attendances.index');
    Route::post('attendances/{id}', [AttendanceController::class, 'update'])->name('admin.attendances.update');
    Route::get('attendances-export/csv', [AttendanceController::class, 'exportCsv'])->name('admin.attendances.export.csv');
    Route::get('attendances-export/pdf', [AttendanceController::class, 'exportPdf'])->name('admin.attendances.export.pdf');
    Route::resource('announcements', AnnouncementController::class)->names('admin.announcements');
});

Route::prefix('employee')->middleware(['auth.employee'])->group(function () {
    Route::get('/dashboard', function () {
        return view('employee.dashboard');
    })->name('employee.dashboard');
    Route::post('logout', [EmployeeLoginController::class, 'logout'])->name('employee.logout');
});



Route::fallback(function () {
    return "Page Not Found";
})->name('not-found');

require __DIR__ . '/auth.php';
