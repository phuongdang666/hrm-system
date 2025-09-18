<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
   
        if (!Auth::guard('admin')->check()) {
            return redirect()->route('admin.login');
        }

        // Nếu sau này bạn có thêm nhiều role trong bảng users, có thể check cụ thể:
        // if (Auth::guard('web')->user()->role !== 'admin') {
        //     abort(403, 'Unauthorized');
        // }

        return $next($request);
    }
}
