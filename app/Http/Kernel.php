<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * The application's global HTTP middleware stack.
     *
     * These middleware are run during every request to your application.
     */
    protected $middleware = [

        // 'ensureRole' => \App\Http\Middleware\EnsureRole::class,
        // 'auth' => \App\Http\Middleware\Authenticate::class,
        // 'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,


    ];
    /**
     * The application's route middleware groups.
     */
    protected $routeMiddleware = [
        'auth' => \App\Http\Middleware\Authenticate::class,
        'auth.admin' => \App\Http\Middleware\AdminMiddleware::class,
        'auth.employee' => \App\Http\Middleware\EmployeeMiddleware::class,
        'guest.admin' => \App\Http\Middleware\RedirectIfAdmin::class,
        'guest.employee' => \App\Http\Middleware\RedirectIfEmployee::class,
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
    ];


}
