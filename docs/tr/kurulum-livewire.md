* [Gorlabs Tailwind Datatable Ana Sayfa](giris.md)
### Laravel Breeze Livewire Projesine gorlabs/tailwind-datatables Paketi Entegrasyon Kılavuzu
Bu kılavuz, mevcut bir Laravel Breeze (Livewire + Blade stack) projesine gorlabs/tailwind-datatables Composer paketini adım adım nasıl entegre edeceğinizi anlatmaktadır. Kılavuz, Tailwind CSS v3.x uyumluluğunu sağlamak için kritik notlar içermektedir.

Ön Gereksinimler
PHP 8.2 veya üzeri

Composer

Node.js ve npm/Yarn

Laravel 12.x


Adım 1: Proje Oluşturma (Laravel Breeze)
Lütfen proje geliştrimeye datatable ile oluşturacağınız bu proje ile başlayın çünkü bir çok sorunu çözmüş olarak başlaycaksınız

Yeni Laravel Projesi Oluştur:

```bash
laravel new livewire-example && cd livewire-example && touch resources/js/bootstrap.js &&  composer require laravel/breeze --dev && php artisan breeze:install livewire
```
Gelen seçeneklerden Livewire seçerek devam edin
Laravel's built-in authentication seçin

Would you like to use Laravel Volt? istediğinizi seçin  sonra Pest yadaPJPUnit seçin devam edin
Would you like to run npm install and npm run build? istediğinizi seçin

Kurulum sorunsuzca tamamlandıysa .env dosyasındaki veritabanı seçeneklerini düzenleyin
Veritabanınızı Hazırlayın:
.env dosyanızda veritabanı bağlantı ayarlarını yapın (örn. DB_DATABASE=gorlabs_datatable).

Adım 2: gorlabs/tailwind-datatables Paketini Kurma
```bash
composer require gorlabs/tailwind-datatables
```
Paketin Asset ve Konfigürasyonlarını Yayınla:
Bu komut, paketin CSS/JS varlıklarını ve konfigürasyon dosyalarını projenizin içine kopyalar.

```bash

php artisan vendor:publish --tag=tailwind-datatables-views
php artisan vendor:publish --tag=gorlabs-tailwind-datatables-config 
php artisan vendor:publish --tag=tailwind-datatables-css
```

## Frontend Yapılandırması (Vite, Tailwind CSS, Alpine.js)

### gorlabs-datatable/tailwind.config.js Güncellemesi (KRİTİK!)
gorlabs-datatable/tailwind.config.js dosyanızı açın.

Dosyanın içeriğini aşağıdaki gibi tamamen değiştirin. Bu, Tailwind Forms pluginini doğru şekilde import edecek ve özel renkleri tanımlayacaktır.

```js
import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
        './resources/js/*.js',
        './resources/css/*.css',
        './vendor/gorlabs/tailwind-datatables/resources/views/**/*.blade.php',
        './vendor/gorlabs/tailwind-datatables/resources/js/**/*.js',
        './vendor/gorlabs/tailwind-datatables/**/*.{html,js,ts,jsx,tsx,vue,css}',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                white: {
                    DEFAULT: 'rgb(var(--color-white) / <alpha-value>)',
                    // ... diğer white tonları ...
                },
                // Her renk için RGB formatında CSS değişkeni referansı
                primary: {
                    DEFAULT: "rgb(var(--color-primary-DEFAULT) / <alpha-value>)",
                    light: "rgb(var(--color-primary-light) / <alpha-value>)",
                    "dark-light": "rgb(var(--color-primary-dark-light) / <alpha-value>)",
                },
                secondary: {
                    DEFAULT: "rgb(var(--color-secondary-DEFAULT) / <alpha-value>)",
                    light: "rgb(var(--color-secondary-light) / <alpha-value>)",
                    "dark-light": "rgb(var(--color-secondary-dark-light) / <alpha-value>)",
                },
                success: {
                    DEFAULT: "rgb(var(--color-success-DEFAULT) / <alpha-value>)",
                    light: "rgb(var(--color-success-light) / <alpha-value>)",
                    "dark-light": "rgb(var(--color-success-dark-light) / <alpha-value>)",
                },
                danger: {
                    DEFAULT: "rgb(var(--color-danger-DEFAULT) / <alpha-value>)",
                    light: "rgb(var(--color-danger-light) / <alpha-value>)",
                    "dark-light": "rgb(var(--color-danger-dark-light) / <alpha-value>)",
                },
                warning: {
                    DEFAULT: "rgb(var(--color-warning-DEFAULT) / <alpha-value>)",
                    light: "rgb(var(--color-warning-light) / <alpha-value>)",
                    "dark-light": "rgb(var(--color-warning-dark-light) / <alpha-value>)",
                },
                info: {
                    DEFAULT: "rgb(var(--color-info-DEFAULT) / <alpha-value>)",
                    light: "rgb(var(--color-info-light) / <alpha-value>)",
                    "dark-light": "rgb(var(--color-info-dark-light) / <alpha-value>)",
                },
                dark: {
                    DEFAULT: "rgb(var(--color-dark-DEFAULT) / <alpha-value>)",
                    light: "rgb(var(--color-dark-light) / <alpha-value>)",
                    "dark-light": "rgb(var(--color-dark-dark-light) / <alpha-value>)",
                },
                black: {
                    DEFAULT: 'rgb(var(--color-black) / <alpha-value>)', // Bu, bg-black'i senin --color-black değişkeninden almasını sağlar
                    // Eğer bg-opacity-50 gibi kullanımların kendi özel black rengin üzerinden olmasını istiyorsan
                    // veya doğrudan black renk paletine kendi değişkenlerini bağlamak istiyorsan:
                    50: 'rgb(var(--color-black-50) / <alpha-value>)', // varsayımsal: --color-black-50 varsa
                    // ... diğer black tonları ...
                },
                // DataTables ile ilişkili özel renkler
                'dt-primary': {
                    DEFAULT: 'rgb(var(--color-dt-primary-DEFAULT) / <alpha-value>)',
                    dark: 'rgb(var(--color-dt-primary-dark) / <alpha-value>)',
                    light: 'rgb(var(--color-dt-primary-light) / <alpha-value>)',
                },
            },
        },
    },

    plugins: [forms],
};


```


### gorlabs-datatable/vite.config.js Güncellemesi (KRİTİK!)
gorlabs-datatable/vite.config.js dosyanızı açın.

Dosyanın içeriğini aşağıdaki gibi tamamen değiştirin. Bu, v4.x'e özgü Vite pluginini kaldıracak ve v3.x için PostCSS yapılandırmasını ekleyecektir.

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

// Tailwind CSS v3 için PostCSS pluginlerini import et
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
plugins: [
    laravel({
        input: ['resources/css/app.css', 'resources/js/app.js'],
        refresh: true,
    }),
],
css: {
    postcss: {
        plugins: [
            tailwindcss,
            autoprefixer,
            ],
        },
    },
server: {
    cors: true,
    },
});

```

### resources/css/app.css Güncellemesi (SON HALİ!)
gorlabs-datatable/resources/css/app.css dosyanızı açın ve içeriğini aşağıdaki kodla tamamen değiştirin:

```css
/* DataTables Responsive stillerini burada ve en başta import edin */
/* DataTables Tailwind stillerini burada ve en başta import edin */
@import "datatables.net-responsive-dt/css/responsive.dataTables.css";
@import '/vendor/gorlabs/tailwind-datatables/resources/css/datatables-tailwind.css';

/* Tailwind CSS direktifleri */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* DataTables ve diğer özel tema renkleri için CSS değişkenleri */
:root {
    --color-primary-DEFAULT: 249 115 22;      /* #f97316 */
    --color-primary-light: 254 243 199;       /* #fef3c7 */
    --color-primary-dark-light: 249 115 22;   /* rgba(249,115,22,.15) -> RGB değerleri */

    --color-secondary-DEFAULT: 249 115 22;    /* #f97316 */
    --color-secondary-light: 254 243 199;     /* #fef3c7 */
    --color-secondary-dark-light: 249 115 22; /* #f97316 */

    --color-success-DEFAULT: 249 115 22;      /* #f97316 */
    --color-success-light: 254 243 199;       /* #fef3c7 */
    --color-success-dark-light: 249 115 22;   /* #f97316 */

    --color-danger-DEFAULT: 249 115 22;       /* #f97316 */
    --color-danger-light: 254 243 199;        /* #fef3c7 */
    --color-danger-dark-light: 249 115 22;    /* #f97316 */

    --color-warning-DEFAULT: 249 115 22;      /* #f97316 */
    --color-warning-light: 254 243 199;       /* #fef3c7 */
    --color-warning-dark-light: 249 115 22;   /* #f97316 */

    --color-info-DEFAULT: 249 115 22;         /* #f97316 */
    --color-info-light: 254 243 199;          /* #fef3c7 */
    --color-info-dark-light: 249 115 22;      /* #f97316 */

    --color-dark-DEFAULT: 249 115 22;         /* #f97316 */
    --color-dark-light: 254 243 199;          /* #fef3c7 */
    --color-dark-dark-light: 249 115 22;      /* #f97316 */

    /* DataTables'ın kendi iç değişkenleri (varsayılanlar veya senin özel ayarın) */
    /* Bunlar genellikle virgülle ayrılmış RGB formatında bekler, bu yüzden formatı korudum.
       Ancak `rgb(var(--color-xyz))` veya `rgba(var(--color-xyz), 0.x)` kullanırken
       `--color-xyz`in boşlukla ayrılmış RGB olması tercih edilir.
       Aşağıdaki `dt-row-selected` gibi değişkenler eğer doğrudan `rgb()` veya `rgba()` içine
       `rgb(var(--dt-row-selected))` gibi geliyorsa boşluk, `rgba(var(--dt-row-selected), 0.5)`
       gibi geliyorsa virgüllü kalabilir. DataTables'ın dökümantasyonuna bakmak en doğrusu,
       ancak şimdilik geneli boşluklu, bu tarz spesifik olanları virgüllü bırakıyorum. */
    --dt-row-selected: 13, 110, 253;
    --dt-row-selected-text: 255, 255, 255;
    --dt-row-selected-link: 0, 0, 0;
    --dt-row-stripe: 0, 0, 0;
    --dt-row-hover: 0, 0, 0;
    --dt-column-ordering: 0, 0, 0;
    --dt-html-background: 255, 255, 255;

    /* DataTables özel renkleri (`dt-primary`) - BOŞLUKLA AYRILMIŞ RGB FORMATINDA */
    --color-dt-primary-DEFAULT: 249 115 22;  /* #f97316 */
    --color-dt-primary-dark: 194 65 12;     /* #c2410c */
    --color-dt-primary-light: 253 186 116;   /* #fdba74 */
}

```



/* Bazı özel durumlar için, doğrudan CSS kurallarına ihtiyacınız olabilir. */
### resources/js/app.js Güncellemesi
gorlabs-datatable/resources/js/app.js dosyasını aç ve içeriğini aşağıdaki gibi güncelleyerek DataTables, Alpine.js ve diğer gerekli kütüphaneleri dahil et:

```js

import './bootstrap';
import $ from 'jquery';
window.$ = window.jQuery = $;

import 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';
import 'datatables.net-buttons/js/buttons.colVis.js';
import 'datatables.net-responsive';
import '../../vendor/gorlabs/tailwind-datatables/resources/js/app';

```


```bash
php artisan make:model Post -mfs
```

### app/Models/Post.php Modelini Güncelle (KRİTİK!)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'published_at',
        'is_published',
        'status',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];
}

```


### database/migrations/YYYY_MM_DD_HHMMSS_create_posts_table.php dosyasını güncelle:
Oluşturulan migration dosyasını (ismi tarihe göre değişir) aç ve up() metodunu aşağıdaki gibi güncelle:

```php
<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
    * Run the migrations.
    */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->string('status')->default('draft');
            $table->timestamps();
        });
    }  
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }  
};
```




### database/factories/PostFactory.php dosyasını güncelleyin:
```php
<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
* @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
  */
class PostFactory extends Factory
{
  /**
    * Define the model's default state.
    *
    * @return array<string, mixed>
      */
      public function definition(): array
      {
          return [
              'title' => fake()->sentence(rand(3, 8)),
              'content' => fake()->paragraphs(rand(1, 3), true),
              'published_at' => fake()->optional(0.8)->dateTimeThisYear(), // %80 ihtimalle bir tarih verir
              'is_published' => fake()->boolean(90), // %90 ihtimalle true
              'status' => fake()->randomElement(['draft', 'published', 'archived']),
          ];
      }
 }


```

### PostSeeder.php düzenleme

```php
<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Post::factory()->count(50)->create();
    }
}


```


### database/seeders/DatabaseSeeder.php dosyasını güncelleyin:

```php
namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
    * Seed the application's database.
    */
    public function run(): void
    {
        User::factory(10)->create(); // Varsayılan kullanıcı seeder
        $this->call([
            PostSeeder::class,
        ]);
    }
}

```


### Veritabanını migrate edin ve seed edin:
Terminalde gorlabs-datatable projenin kök dizinindeyken bu komutu çalıştır:

```bash
php artisan migrate:fresh --seed
```


### gorlabs-datatable/vite.config.js

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
// import tailwindcss from "@tailwindcss/vite"; // BU SATIRI SİL!

// Tailwind CSS v3 için PostCSS pluginlerini import et
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        // tailwindcss(), // BU SATIRI SİL!
    ],
    build: {
        minify: false, // Minification'ı kapatıyoruz
        sourcemap: true, // Hata ayıklama için sourcemap oluştur
    },
    css: { // Yeni css bloğunu buraya ekle
        postcss: {
            plugins: [
                tailwindcss,
                autoprefixer,
            ],
        },
    },
    server: {
        cors: true,
    },
});

```   


### app/DataTables/PostsDataTable.php Oluşturma
  ```bash
php artisan datatable:make PostsDataTable --model=Post
``` 
### app/DataTables/PostsDataTable.php içeriğini güncelleyin:
```php
<?php

namespace App\DataTables;

use App\Models\Post;
use Illuminate\Database\Eloquent\Builder as QueryBuilder;
use Yajra\DataTables\EloquentDataTable;
use Yajra\DataTables\Html\Builder as HtmlBuilder;
use Yajra\DataTables\Html\Button;
use Yajra\DataTables\Html\Column;
use Yajra\DataTables\Services\DataTable;

class PostsDataTable extends DataTable
{
    public function query(Post $model): QueryBuilder
    {
        return $model->newQuery();
    }

    public function dataTable(QueryBuilder $query): EloquentDataTable
    {
        return (new EloquentDataTable($query))
            ->setRowId('id')
            ->addColumn('select_checkbox', function(Post $post) {
                return '';
            })
            ->addColumn('actions', function(Post $post) {
                return '';
            })
            ->editColumn('is_published', function(Post $post) {
                return $post->is_published ? 1 : 0;
            })
            ->editColumn('published_at', function(Post $post) {
                return $post->published_at ? $post->published_at->format('Y-m-d H:i:s') : null;
            })
            ->editColumn('title', function(Post $post) {
                $title = $post->title;
                if (strlen($title) > 24) {
                    return substr($title, 0, 24) . ' ...';
                }
                return $title;
            })
            ->editColumn('content', function(Post $post) {
                $content = $post->content;
                if (strlen($content) > 34) {
                    return substr($content, 0, 34) . ' ...';
                }
                return $content;
            });
    }

    public function html(): HtmlBuilder
    {
        return $this->builder()
            ->setTableId('posts-table')
            ->columns($this->getColumns())
            ->minifiedAjax()
            ->orderBy(1)
            ->select(false)
            ->buttons([
                Button::make('create'),
                Button::make('export'),
                Button::make('print'),
                Button::make('reset'),
                Button::make('reload')
            ]);
    }

    public function getColumns(): array
    {
        $columns = [
            Column::computed('select_checkbox')
                ->title('<input type="checkbox" id="select-all-checkbox" class="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500">')
                ->exportable(false)
                ->printable(false)
                ->width(10)
                ->addClass('text-center')
                ->orderable(false)
                ->searchable(false)
                ->footer('')
                ->responsivePriority(1),
            Column::make('id')->responsivePriority(2),
            Column::make('title')->responsivePriority(3),
            Column::make('content')->responsivePriority(5),
            Column::make('published_at')
                ->title('Published At')
                ->width(150)
                ->responsivePriority(4),
            Column::make('is_published')
                ->title('Published')
                ->width(100)
                ->responsivePriority(4),
            Column::make('status')->responsivePriority(4),
        ];

        $columns[] = Column::computed('actions')
            ->title('ACTIONS')
            ->exportable(false)
            ->printable(false)
            ->width(120)
            ->addClass('text-center')
            ->orderable(false)
            ->searchable(false)
            ->footer('')
            ->responsivePriority(1);

        return $columns;
    }

    protected function filename(): string
    {
        return 'Posts_' . date('YmdHis');
    }
}


```

### app/Http/Controllers/PostController.php Oluşturma
Terminalde gorlabs-datatable projenin kök dizinindeyken aşağıdaki komutu çalıştır:

```bash
php artisan make:controller PostController --resource
```

### app/Http/Controllers/PostController.php içeriğini güncelleyin:
```php
<?php

namespace App\Http\Controllers;

use App\DataTables\PostsDataTable;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     * DataTable'ı göstermek için ana view'ı döndürür.
     */
    public function index()
    {
        return view('posts.index');
    }

    /**
     * Process datatables ajax request.
     * Yajra DataTables'tan gelen AJAX isteğini işler ve JSON yanıtı döndürür.
     *
     * @param PostsDataTable $dataTable DataTable sınıfının örneği (dependency injection ile).
     * @return JsonResponse
     */
    public function ajaxData(PostsDataTable $dataTable)
    {
        Log::info('DataTables AJAX isteği parametreleri:', request()->all());
        // DataTable'ın query metodunu kullanarak verileri çeker ve işler.
        return $dataTable->dataTable($dataTable->query(new Post()))->make(true);
    }

    /**
     * Show the form for creating a new resource.
     * Yeni bir post oluşturmak için formu gösterir (modal içinde yüklenecek).
     */
    public function create()
    {
        // Boş bir Post modeli örneği göndererek formun boş başlamasını sağlarız.
        // Bu, `postForm` Alpine bileşeninin `initialPost` config'ini besler.
        return view('tailwind-datatables::datatables.form', ['post' => new Post()]);
    }

    /**
     * Store a newly created resource in storage.
     * Yeni oluşturulan post verilerini veritabanına kaydeder.
     *
     * @param Request $request Gelen HTTP isteği.
     * @return JsonResponse
     */
    public function store(Request $request)
    {
        // Gelen isteği doğrula (validation).
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            // 'is_published' alanı checkbox'tan geldiği için bazen 'on' veya null olabilir.
            // Laravel'in validate'i boolean için bunu otomatik dönüştürebilir,
            // ancak manuel kontrol daha güvenli olabilir.
            'is_published' => 'nullable|boolean', // nullable ekledik
            'published_at' => 'nullable|date',
        ]);

        // published_at alanı boş gelirse null yap veya karbon objesine dönüştür.
        $data = $request->except(['published_at']); // published_at'ı ayrı ele alıyoruz
        $data['published_at'] = $request->input('published_at') ? now()->parse($request->input('published_at')) : null;
        $data['is_published'] = (bool) $request->input('is_published', 0); // checkbox değeri varsa true, yoksa false

        $post = Post::create($data); // Post modelini kullanarak yeni kayıt oluştur.

        // Başarılı yanıtı JSON olarak döndür.
        return response()->json(['success' => 'Post başarıyla oluşturuldu.', 'post' => $post]);
    }

    /**
     * Show the form for editing the specified resource.
     * Belirtilen postu düzenlemek için formu gösterir (modal içinde yüklenecek).
     *
     * @param Post $post Düzenlenecek Post modeli (Route Model Binding).
     * @return \Illuminate\View\View
     */
    public function edit(Post $post)
    {
        // `datetime-local` inputu için `YYYY-MM-DDTHH:mm` formatında bir string hazırlıyoruz.
        // Eğer published_at null ise boş string gönderiyoruz.
        $post->published_at_formatted = $post->published_at ? $post->published_at->format('Y-m-d\TH:i') : '';

        // Mevcut post verisini `posts.form` view'ına gönderiyoruz.
        // Bu, `postForm` Alpine bileşeninin `initialPost` config'ini besler.
        return view('tailwind-datatables::datatables.form', compact('post'));
    }

    /**
     * Update the specified resource in storage.
     * Belirtilen post verilerini günceller.
     *
     * @param Request $request Gelen HTTP isteği.
     * @param Post $post Güncellenecek Post modeli.
     * @return JsonResponse
     */
    public function update(Request $request, Post $post)
    {
        //dd($request->all());
        // Gelen isteği doğrula.
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'is_published' => 'boolean|nullable', // nullable ekledik
            'published_at' => 'nullable|date',
        ]);

        $data = $request->except(['published_at']); // published_at'ı ayrı ele alıyoruz
        $data['is_published'] = (bool) $request->input('is_published', 0); // checkbox değeri varsa true, yoksa false
        $data['published_at'] = $request->input('published_at') ? now()->parse($request->input('published_at')) : null;
        //dd($data);
        $post->update($data); // Post modelini kullanarak kaydı güncelle.

        // Başarılı yanıtı JSON olarak döndür.
        return response()->json(['success' => 'Post başarıyla güncellendi.', 'post' => $post]);
    }

    /**
     * Remove the specified resource from storage.
     * Belirtilen postu veritabanından siler.
     *
     * @param Post $post Silinecek Post modeli.
     * @return JsonResponse
     */
    public function destroy(Post $post)
    {
        try {
            $post->delete();
            return response()->json(['success' => 'Post başarıyla silindi.']);
        } catch (\Exception $e) {
            // Hata durumunda loglama ve hata mesajı döndürme
            Log::error('Post silinirken hata oluştu: ' . $e->getMessage(), ['post_id' => $post->id]);
            return response()->json(['error' => 'Post silinirken bir hata oluştu.'], 500);
        }
    }
}
```
### post.config.js içeriğini güncelleyin
```js
export default {
    plugins: {
        '@tailwindcss/postcss': {},
        autoprefixer: {},
    },
};
```

### routes/web.php Güncellemesi
gorlabs-datatable/routes/web.php dosyanızı açın ve aşağıdaki rotaları ekleyin.

```php
use App\Http\Controllers\PostController;
require __DIR__.'/auth.php';

// Yeni Eklenen Post Rotları
Route::resource('posts', PostController::class);
Route::get('posts-data', [PostController::class, 'ajaxData'])->name('posts.data');
```



## Blade View'ları Hazırlama
Bu adımda, paketin DataTables'ı ve modal yapısını kullanacak Blade view'larını projenizde oluşturacağız.
```bash
mkdir -p resources/views/posts
touch resources/views/posts/index.blade.php 
```
### resources/views/posts/index.blade.php Oluşturma
resources/views/posts/index.blade.php yolunda yeni bir dosya oluşturun (eğer yoksa, resources/views/posts klasörünü de oluşturmanız gerekebilir) ve içeriğini aşağıdaki kodla doldurun:

```html
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Laravel Tailwind DataTables</title>

    <meta name="csrf-token" content="{{ csrf_token() }}">

    @vite([
    'resources/css/app.css',
    'resources/js/app.js'
    ])

    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
    </style>
</head>
<body class="antialiased bg-gray-100 text-gray-900 min-h-screen p-8">

<div class="container mx-auto" x-data="app()">
    <h1 class="text-3xl font-bold text-center mb-8">Posts Listesi (Tailwind DataTables)</h1>

    @php
    use App\DataTables\PostsDataTable;
    $columns = collect((new PostsDataTable())->getColumns());
    @endphp
    <div class="panel mt-6 overflow-x-auto p-3" x-data='crudDataTable({
            datatableId: "posts-table",
            ajaxUrl: "{{ route('posts.data') }}",
    columns: {!! json_encode($columns->map(function($col) {
    return [
    "data" => $col->name,
    "name" => $col->name,
    "title" => $col->title,
    "orderable" => $col->orderable,
    "searchable" => $col->searchable,
    "className" => $col->className ?? "",
    ];
    })) !!},
    perPage: 10,
    perPageSelect: [10, 25, 50, 100, -1],
    addNewButtonText: "Yeni Post Ekle",
    addEditUrl: "{{ route('posts.create') }}",
    updateUrlPrefix: "{{ url('posts') }}",
    deleteUrlPrefix: "{{ url('posts') }}",
    initialFormState: JSON.parse("{}"),
    responsive: true
    })' x-ref="dataTableContainer">
    {{-- DataTables HTML --}}
    <table id="posts-table" class="min-w-full divide-y divide-gray-200 dark:divide-gray-700" style="width:100%" x-ref="dataTable">
        <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
            @foreach($columns as $column)
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $column->title }}
            </th>
            @endforeach
        </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        {{-- DataTables ajax ile doldurulacak --}}
        </tbody>
    </table>
</div>

{{-- Modal Container --}}
<div
    x-data="globalModal()"
    x-show="open"
    x-transition:enter="transition ease-out duration-300"
    x-transition:enter-start="opacity-0"
    x-transition:enter-end="opacity-100"
    x-transition:leave="transition ease-in duration-200"
    x-transition:leave-start="opacity-100"
    x-transition:leave-end="opacity-0"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @keydown.escape.window="closeModal"
>
    <div
        class="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-4xl w-full max-h-full overflow-auto p-6 relative"
        @click.away="closeModal"
    >
        <h2 class="text-xl font-semibold mb-4" x-text="title"></h2>
        <div id="modal-content"></div>
        <button
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            @click="closeModal"
            aria-label="Close modal"
        >
            &times;
        </button>
    </div>
</div>
</div>

</body>
</html>
```

## Paketleri yükleyin Son Dokunuşlar:



```bash

composer update  
composer dump-autoload
php artisan optimize:clear 
npm cache clean --force
rm -rf node_modules yarn.lock package-lock.json
rm -rf public/build 
npm install alpinejs @alpinejs/collapse @alpinejs/focus @alpinejs/persist @alpinejs/ui dayjs jquery datatables.net datatables.net-responsive datatables.net-buttons datatables.net-buttons-dt datatables.net-dt datatables.net-responsive-dt jszip pdfmake sweetalert2
npm install --save-dev @tailwindcss/postcss @tailwindcss/vite autoprefixer axios concurrently 
php artisan optimize:clear 
npm cache clean --force
npm run dev 
```
 
 
