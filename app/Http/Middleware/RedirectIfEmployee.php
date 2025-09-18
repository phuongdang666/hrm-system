<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectIfEmployee
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::guard('employee')->check()) {
            return redirect()->route('employee.dashboard');
        }

        return $next($request);
    }
}