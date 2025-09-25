<?php
namespace App\Providers;
use Illuminate\Support\ServiceProvider; 

class EventServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    protected $listen = [
        \App\Events\NewEmployee::class => [
            \App\Listeners\SendWelcomeEmail::class,
            // \App\Listeners\NotifyAdminNewEmployee::class,
        ],
    ];

    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}