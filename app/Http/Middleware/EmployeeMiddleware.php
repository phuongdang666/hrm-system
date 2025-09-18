<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmployeeMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Dùng guard 'employee' cho nhân viên
        if (!Auth::guard('employee')->check()) {
            return redirect()->route('employee.login');
        }

        return $next($request);
    }
}
