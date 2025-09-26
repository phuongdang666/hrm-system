<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Models\Admin;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind('admin', function () {
            return new Admin();
        });
        $this->app->bind('employee', function () {
            return new \App\Models\Employee();
        });

        // Bind middleware alias names to their concrete classes so they can be
        // resolved via the container when the kernel attempts to make them
        // during the terminate phase. This prevents "Target class [auth.admin] does not exist.".
        $this->app->bind('auth.admin', \App\Http\Middleware\AdminMiddleware::class);
        $this->app->bind('auth.employee', \App\Http\Middleware\EmployeeMiddleware::class);
        $this->app->bind('guest.admin', \App\Http\Middleware\RedirectIfAdmin::class);
        $this->app->bind('guest.employee', \App\Http\Middleware\RedirectIfEmployee::class);
        $this->app->bind('role', \App\Http\Middleware\CheckRole::class);

        // Repositories
        $this->app->bind(
            \App\Repositories\Contracts\AttendanceRepositoryInterface::class,
            \App\Repositories\AttendanceRepository::class   
        );
        $this->app->bind(
            \App\Repositories\Contracts\LeaveRequestRepositoryInterface::class,
            \App\Repositories\LeaveRequestRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\PayrollRepositoryInterface::class,
            \App\Repositories\PayrollRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Ensure route middleware aliases are registered on the router so
        // they can be resolved during the request lifecycle (including terminate()).
        // $router = $this->app->make('\Illuminate\Routing\Router');
        // $router->aliasMiddleware('check.role', \App\Http\Middleware\CheckRole::class);
    }
}
