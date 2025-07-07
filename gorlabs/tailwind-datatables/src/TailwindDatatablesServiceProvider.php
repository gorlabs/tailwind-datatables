<?php

namespace Gorlabs\TailwindDatatables;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;

class TailwindDatatablesServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'tailwind-datatables');

        $this->publishes([
            __DIR__.'/../resources/views' => resource_path('views/vendor/tailwind-datatables'),
        ], 'tailwind-datatables-views');

        $this->publishes([
            __DIR__.'/../config/gorlabs-tailwind-datatables.php' => config_path('gorlabs-tailwind-datatables.php'),
        ], 'gorlabs-tailwind-datatables-config');

        // YENİ EKLENEN KOD: CSS Dosyasını yayımlama
        $this->publishes([
            __DIR__.'/../resources/css/_utility-colors.css' => resource_path('css/_utility-colors.css'),
            __DIR__.'/../resources/css/datatables-tailwind.css' => resource_path('css/datatables-tailwind.css'),
        ], 'tailwind-datatables-css'); // Bu, CSS dosyasını yayımlamak için yeni bir publish grubu oluşturur.

        // YAJRA DATATABLES HTML YAPILANDIRMASINI OTOMATİK SET ETME
        // Bu kısım, kullanıcıların config/datatables-html.php dosyasını elle değiştirmesini engeller.
        Config::set('datatables-html.script', 'tailwind-datatables::datatable.scripts');
        Config::set('datatables-html.view', 'tailwind-datatables::datatable.table');

    }

    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->mergeConfigFrom(
            __DIR__.'/../config/gorlabs-tailwind-datatables.php', 'gorlabs-tailwind-datatables'
        );
    }
}
