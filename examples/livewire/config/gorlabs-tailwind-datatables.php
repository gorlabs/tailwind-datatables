<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Tailwind Datatables Configuration
    |--------------------------------------------------------------------------
    |
    | Bu dosya, Gorlabs Tailwind Datatables paketinin yapılandırma ayarlarını içerir.
    | Paketle ilgili genel ayarlar burada tanımlanır.
    |
    */

    'vendor' => 'gorlabs',
    'author' => 'Mehmet Çetin Ravullu',

    /*
    |--------------------------------------------------------------------------
    | DataTables Varsayılan Seçenekleri
    |--------------------------------------------------------------------------
    | Yajra DataTables için varsayılan yapılandırma seçenekleri.
    |
    */
    'defaults' => [
        'dom' => '<"flex flex-col sm:flex-row justify-between items-center mb-4"lfB><"overflow-x-auto"rt><"flex flex-col sm:flex-row justify-between items-center mt-4"ip>',
        'buttons' => [
            'excel', 'csv', 'pdf', 'print', 'colvis'
        ],
        'language' => [
            'url' => '//cdn.datatables.net/plug-ins/1.10.25/i18n/Turkish.json' // Türkçe dil dosyası
        ],
        'responsive' => true, // Duyarlılık varsayılan olarak açık
        'pagingType' => 'full_numbers', // Varsayılan sayfalama tipi
    ],

    /*
    |--------------------------------------------------------------------------
    | Blade View Yolları
    |--------------------------------------------------------------------------
    | Paketin kullandığı Blade view dosyalarının yolları.
    |
    */
    'views' => [
        'table' => 'tailwind-datatables::datatable.table',
        'scripts' => 'tailwind-datatables::datatable.scripts',
    ],

    /*
    |--------------------------------------------------------------------------
    | Asset Yolları
    |--------------------------------------------------------------------------
    | Paketin yayımladığı JavaScript ve CSS dosyalarının varsayılan yolları.
    |
    */
    'assets' => [
        'js' => 'vendor/gorlabs/tailwind-datatables/resources/js/crud-datatable.js',
        'css' => 'vendor/gorlabs/tailwind-datatables/resources/css/datatables-tailwind.css',
    ],

    /*
    |--------------------------------------------------------------------------
    | Özel Render Fonksiyon Ayarları
    |--------------------------------------------------------------------------
    | Özel DataTables render fonksiyonları için yapılandırma.
    |
    */
    'render_options' => [
        'date_format' => 'DD.MM.YYYY HH:mm',
        'text_truncate_length' => 50,
        'status_badges' => [
            'published' => ['text' => 'Yayınlandı', 'class' => 'bg-green-500'],
            'draft' => ['text' => 'Taslak', 'class' => 'bg-red-500'],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Tema Renkleri (Tailwind)
    |--------------------------------------------------------------------------
    | DataTables bileşenleri için varsayılan Tailwind renk sınıfları.
    |
    */
    'theme_colors' => [
        'primary_button' => 'bg-indigo-600 hover:bg-indigo-700 text-white',
        'secondary_button' => 'bg-gray-200 hover:bg-gray-300 text-gray-700',
        'pagination_active' => 'bg-indigo-600 text-white hover:bg-indigo-700',
        'pagination_inactive' => 'bg-white hover:bg-gray-50 text-gray-700',
    ],
];
