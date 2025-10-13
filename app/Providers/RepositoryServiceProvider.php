<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\AnnouncementRepositoryInterface;
use App\Repositories\AnnouncementRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(AnnouncementRepositoryInterface::class, AnnouncementRepository::class);
    }

    public function boot()
    {
        //
    }
}