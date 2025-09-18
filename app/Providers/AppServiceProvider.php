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
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Ensure route middleware aliases are registered on the router so
        // they can be resolved during the request lifecycle (including terminate()).
        // This helps avoid "Target class [auth.admin] does not exist." errors
        // when middleware aliases are referenced in routes but not yet available.
        
        // $router = $this->app->make('\Illuminate\Routing\Router');

        // $router->aliasMiddleware('auth.admin', \App\Http\Middleware\AdminMiddleware::class);
        // $router->aliasMiddleware('auth.employee', \App\Http\Middleware\EmployeeMiddleware::class);
        // $router->aliasMiddleware('guest.admin', \App\Http\Middleware\RedirectIfAdmin::class);
        // $router->aliasMiddleware('guest.employee', \App\Http\Middleware\RedirectIfEmployee::class);
    }
}
