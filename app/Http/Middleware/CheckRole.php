<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{

    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user('employee');
        if (!$user || $user->role !== $role) {
            Log::warning("Unauthorized access attempt by user ID: " . ($user ? $user->id : 'guest') . " for role: $role");
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
