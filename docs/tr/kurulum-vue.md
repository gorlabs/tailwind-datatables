* [Gorlabs Tailwind Datatable Ana Sayfa](giris.md)
# Laravel + Vue + Tailwind DataTables Kurulum Rehberi

Bu rehber, Laravel projesi oluşturma, Vue ve Inertia.js kurulumu, ayrıca `gorlabs/tailwind-datatables` paketinin kurulumu ve yapılandırmasını adım adım anlatmaktadır.

---

## 1. Laravel Projesi Oluşturma

İlk olarak yeni bir Laravel projesi oluşturun, lütfen prtoje geliştrimeye bu adımla başlayın her şeyin doğru kurulumla başlaması önemlidir:

```bash
laravel new gorlabs-datatable-vue && cd gorlabs-datatable-vue && composer require laravel/breeze --dev && touch resources/js/bootstrap.js && php artisan breeze:install vue &&  rm resources/js/app.ts && rm vite.config.ts && rm -rf resources/js/pages
 

```
package.json karmaşasını düzeltme
laravel - vue stack kurulumunda gelen package json dosyası temiz ve düzdelidir, ancak breeze:instal vue komutunu çalıştırdığınız zaman bu scaffold maalesef mevcut düzeni bozmaktadır.
zaten kurulum scriptimizle bu eklemenin verdiği zararların büyük bölümü gidelidi şimdi package.json dosyanızı temzilemeniz gerekiyor çünkü bu breeze:installa vue komutru tarafından kirletildi ve çakışmalara nedne olacaktır
şu aşamada  package.json dosyası şu şekilde olmalıdır

```json
{
    "private": true,
    "type": "module",
    "scripts": {
        "build": "vite build",
        "build:ssr": "vite build && vite build --ssr",
        "dev": "vite",
        "format": "prettier --write resources/",
        "format:check": "prettier --check resources/",
        "lint": "eslint . --fix"
    },
    "devDependencies": {
        "@eslint/js": "^9.19.0",
        "@tailwindcss/forms": "^0.5.3",
        "@types/node": "^22.13.5",
        "@vue/eslint-config-typescript": "^14.3.0",
        "autoprefixer": "^10.4.12",
        "eslint": "^9.17.0",
        "eslint-config-prettier": "^10.0.1",
        "eslint-plugin-vue": "^9.32.0",
        "postcss": "^8.4.31",
        "prettier": "^3.4.2",
        "prettier-plugin-organize-imports": "^4.1.0",
        "prettier-plugin-tailwindcss": "^0.6.11",
        "typescript-eslint": "^8.23.0",
        "vue-tsc": "^2.2.4"
    },
    "dependencies": {
        "@inertiajs/vue3": "^2.0.0",
        "@tailwindcss/vite": "^4.1.1",
        "@vitejs/plugin-vue": "^5.2.1",
        "@vueuse/core": "^12.8.2",
        "class-variance-authority": "^0.7.1",
        "clsx": "^2.1.1",
        "concurrently": "^9.0.1",
        "laravel-vite-plugin": "^1.0",
        "lucide-vue-next": "^0.468.0",
        "reka-ui": "^2.2.0",
        "tailwind-merge": "^3.2.0",
        "tailwindcss": "^4.1.1",
        "tw-animate-css": "^1.2.5",
        "typescript": "^5.2.2",
        "vite": "^6.2.0",
        "vue": "^3.5.13",
        "ziggy-js": "^2.4.2"
    } 
}

```

2. Composer Paket Kurulumu

```bash
composer require gorlabs/tailwind-datatables
```
Paketleri yayımlayın:

```bash

composer update

php artisan vendor:publish --tag=tailwind-datatables-views
php artisan vendor:publish --tag=gorlabs-tailwind-datatables-config 
php artisan vendor:publish --tag=tailwind-datatables-css
```



Ardından, resources/js/app.js dosyasının içeriğini aşağıdaki gibi güncelleyin. Bu dosya zaten mevcut olmalıdır.

```typescript 

// resources/js/app.js
import '../css/app.css';
// ********************************************************************
// * DataTables ve İlgili Kütüphaneler (SADECE GLOBAL İHTİYAÇLAR)     *
// ********************************************************************

import jQuery from 'jquery';
window.jQuery = jQuery;
window.$ = jQuery;

import 'datatables.net';
import 'datatables.net-buttons';
import 'datatables.net-buttons/js/buttons.html5.js'; // HTML5 export butonları
import 'datatables.net-buttons/js/buttons.print.js'; // Print butonu
import 'datatables.net-buttons/js/buttons.colVis.js'; // Column visibility butonu
import 'datatables.net-responsive';



import JSZip from 'jszip';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
window.JSZip = JSZip;
window.pdfMake = pdfMake;
window.pdfMake.vfs = pdfFonts.vfs;

import Swal from 'sweetalert2';
window.Swal = Swal;

import dayjs from 'dayjs';
window.dayjs = dayjs;
import Alpine from 'alpinejs';

import { registerGorlabsDatatablesAlpineComponents } from '../../vendor/gorlabs/tailwind-datatables/resources/js/crud-datatable';


// ********************************************************************
// * Mevcut Inertia.js ve Vue başlatma kodları (DEĞİŞTİRME)            *
// ********************************************************************
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createApp, h } from 'vue';
import { ZiggyVue } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.vue`,
            import.meta.glob('./Pages/**/*.vue'),
        ),
    setup({ el, App, props, plugin }) {
        return createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue)
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});
// Yeni Eklenecek Kısım: Alpine.js'in yüklenmesini bekleyip bileşenleri kaydet
// Bu event listener, Alpine.js CDN'den yüklendiğinde ve hazır olduğunda tetiklenir.
registerGorlabsDatatablesAlpineComponents(Alpine); // Bileşenleri kaydet
Alpine.start();



```
postcss.config.js içeriğini güncelleyin
```js
export default {
    plugins: {
        '@tailwindcss/postcss': {},
        autoprefixer: {},
    },
};
```



6. Vite Konfigürasyonları

vite.config.js dosyasının içeriğini aşağıdaki gibi güncelleyin. Bu dosya zaten mevcut olmalıdır.

```typeScript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js'
            ],
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
    build: {
        minify: true, //  Minificaiton open
        sourcemap: true, // Hata ayıklama için sourcemap oluştur
    },
    server: {
        cors: true,
    },

});




```
X. resources/js/types/global.d.ts içeriğini güncelleyin

```ts
//resources/js/types/globals.d.ts
import { AppPageProps } from '@/types/index';
import type Swal from 'sweetalert2'; // type import kullan
import type dayjs from 'dayjs';     // type import kullan
import type Alpine from 'alpinejs';  // type import kullan
import type * as pdfMake from 'pdfmake/build/pdfmake'; // type import kullan
import type * as JSZip from 'jszip'; // type import kullan

// Extend ImportMeta interface for Vite...
declare module 'vite/client' {
    interface ImportMetaEnv {
        readonly VITE_APP_NAME: string;
        [key: string]: string | boolean | undefined;
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
        readonly glob: <T>(pattern: string) => Record<string, () => Promise<T>>;
    }
}

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps, AppPageProps {}
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $inertia: typeof Router;
        $page: Page;
        $headManager: ReturnType<typeof createHeadManager>;
    }
}

declare global {
    interface Window {
        GorlabsDatatables: {
            date: (format: string) => (data: any, type: string, row: any) => string;
            statusBadge: (publishedText: string, draftText: string) => (data: any, type: string, row: any) => string;
            actions: (updateUrlPrefix: string, deleteUrlPrefix: string) => (data: any, type: string, row: any) => string;
            // Diğer GorlabsDatatables metotlarını da buraya ekleyin
        };
        Swal: any; // SweetAlert2 için de benzer şekilde ekleyebilirsiniz
        openFormModal: (title: string, url: string, item: any | null) => void; // Global fonksiyon için de
    }
}

// ********************************************************************
// * Yeni Eklenecek Kısım: Global Window Objektif Tanımları             *
// ********************************************************************
declare global {
    interface Window {
        Swal: typeof Swal;
        dayjs: typeof dayjs;
        Alpine: typeof Alpine;
        pdfMake: typeof pdfMake;
        JSZip: typeof JSZip;
        jQuery: JQuery;
        $: JQuery;
        crudDataTable: (config: any) => any;
    }
}

```



7. PHP Backend Dosyaları
   Migration Oluşturma
   Posts tablosunu oluşturmak için bir migration dosyası oluşturun ve içeriğini aşağıdakilerle değiştirin:

```bash
php artisan make:migration create_posts_table
```


Oluşan dosya yolu: database/migrations/YYYY_MM_DD_HHMMSS_create_posts_table.php (buradaki YYYY_MM_DD_HHMMSS kısmı tarih ve saate göre değişecektir). İçeriğini aşağıdaki gibi güncelleyin:

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
            $table->text('content');
            $table->timestamp('published_at')->nullable(); // Yayım tarihi
            $table->boolean('is_published')->default(false); // Durum (yayınlandı mı?)
            $table->string('status')->default('draft'); // Örnek olarak eklendi
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

Model Oluşturma
Post modelini ve PostFactory.php yi oluşturun ve içeriklerini aşağıdakilerle değiştirin:

```bash
php artisan make:model Post -f
```
Oluşan dosya yolu: app/Models/Post.php. İçeriğini aşağıdaki gibi güncelleyin:

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

PostFactory.php içeriği aşağıdaki gib olmalı
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

```bash
php artisan make:seeder PostSeeder
```


PostSeeder.php içeriği
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
        // 50 adet sahte Post oluştur
        Post::factory()->count(50)->create();
    }
}

```

DatabaseSeeder.php içeriği

```php
<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Database\Factories\PostFactory;use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
        $this->call([PostSeeder::class,]);
    }
}

```


DataTable Sınıfı Oluşturma
PostsDataTable sınıfını oluşturun ve içeriğini aşağıdakilerle değiştirin:

```bash
php artisan datatable:make PostsDataTable --model=Post
```

Oluşan dosya yolu: app/DataTables/PostsDataTable.php. İçeriğini aşağıdaki gibi güncelleyin:

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
        return $model->newQuery()->select('id', 'title', 'content', 'is_published', 'published_at', 'status', 'created_at', 'updated_at');
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


Controller Oluşturma
PostController sınıfını oluşturun ve içeriğini aşağıdakilerle değiştirin:

```bash
php artisan make:controller PostController
```


Oluşan dosya yolu: app/Http/Controllers/PostController.php. İçeriğini aşağıdaki gibi güncelleyin:

```php
<?php

namespace App\Http\Controllers;

use App\DataTables\PostsDataTable;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(PostsDataTable $postsDataTable)
    {
        $columns = $postsDataTable->getColumns();

        $formattedColumns = collect($columns)->map(function ($column) {
            return [
                'data' => $column->data,
                'name' => $column->name,
                'title' => $column->title,
                'orderable' => $column->orderable,
                'searchable' => $column->searchable,
                'className' => $column->className ?? '',
            ];
        })->toArray();

        return Inertia::render('Posts/Index', [
            'columns' => $formattedColumns,
        ]);
    }

    public function ajaxData(PostsDataTable $dataTable)
    {
        Log::info('DataTables AJAX isteği parametreleri:', request()->all());
        return $dataTable->dataTable($dataTable->query(new Post()))->make(true);
    }

    public function create()
    {
        return view('tailwind-datatables::datatables.form', ['post' => new Post()]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'is_published' => 'nullable|boolean',
            'published_at' => 'nullable|date',
        ]);

        $data = $request->except(['published_at']);
        $data['published_at'] = $request->input('published_at') ? now()->parse($request->input('published_at')) : null;
        $data['is_published'] = (bool) $request->input('is_published', 0);

        $post = Post::create($data);

        return response()->json(['success' => 'Post başarıyla oluşturuldu.', 'post' => $post]);
    }

    public function edit(Post $post)
    {
        $post->published_at_formatted = $post->published_at ? $post->published_at->format('Y-m-d\TH:i') : '';

        return view('tailwind-datatables::datatables.form', compact('post'));
    }

    public function update(Request $request, Post $post)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'is_published' => 'boolean|nullable',
            'published_at' => 'nullable|date',
        ]);

        $data = $request->except(['published_at']);
        $data['is_published'] = (bool) $request->input('is_published', 0);
        $data['published_at'] = $request->input('published_at') ? now()->parse($request->input('published_at')) : null;

        $post->update($data);

        return response()->json(['success' => 'Post başarıyla güncellendi.', 'post' => $post]);
    }

    public function destroy(Post $post)
    {
        try {
            $post->delete();
            return response()->json(['success' => 'Post başarıyla silindi.']);
        } catch (\Exception $e) {
            Log::error('Post silinirken hata oluştu: ' . $e->getMessage(), ['post_id' => $post->id]);
            return response()->json(['error' => 'Post silinirken bir hata oluştu.'], 500);
        }
    }
}



```



8. Vue Bileşeni
   resources/js/Pages/Posts/Index.vue dosyasını oluşturun ve içeriğini aşağıdakilerle değiştirin:

```bash
mkdir -p resources/js/Pages/Posts
touch resources/js/Pages/Posts/Index.vue
```


Oluşan dosya yolu: resources/js/Pages/Posts/Index.vue. İçeriğini aşağıdaki gibi güncelleyin:

Kod snippet'i
```vue
<script setup lang="ts">
    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';

    import { Head } from '@inertiajs/vue3';

    import { onMounted, ref } from 'vue';

    // Backend'den gelen columns prop'unu tanımla

    const props = defineProps<{
        columns: Array<{
            data: string;

            name: string;

            title: string;

            orderable: boolean;

            searchable: boolean;

            className?: string; // className opsiyonel olabilir
        }>;
    }>();

    console.log('Props Columns:', props.columns);

    // DataTables'ın HTML yapısı için bir ref oluştur

    const dataTableContainer = ref<HTMLElement | null>(null);

    // crudDataTable config'i props'tan gelen kolonları kullanarak tanımlıyoruz.

    const datatableConfig = {
        datatableId: 'posts-table',

        ajaxUrl: route('posts.data'),

        columns: props.columns, // Kolonları props'tan alıyoruz!

        perPage: 10,

        perPageSelect: [10, 25, 50, 100, -1],

        addNewButtonText: 'Add New Post',

        addEditUrl: route('posts.create'),

        updateUrlPrefix: route('posts.update', ''),

        deleteUrlPrefix: route('posts.destroy', ''),

        initialFormState: {},

        responsive: true, // Responsive özelliği burada true olarak ayarlı
    };

    // DataTables instance'ını saklamak için bir ref

    const dataTableInstance = ref<any>(null);

    const $ = window.$ as any;

    onMounted(() => {
        // jQuery ve DataTables'ın global olarak mevcut olduğundan emin ol

        if (typeof window.$ === 'undefined' || typeof (window.$ as any).fn.DataTable === 'undefined') {
            console.error('jQuery or DataTables is not available globally.');

            return;
        }

        // GorlabsDatatables'ın varlığını kontrol et

        if (typeof window.GorlabsDatatables === 'undefined') {
            console.error('GorlabsDatatables is not available globally.');

            return;
        }

        // DataTables'ı başlat

        // 'as any' kullanarak TypeScript'in jQuery tipini aşırı yüklemesini engelliyoruz

        dataTableInstance.value = $('#' + datatableConfig.datatableId).DataTable({
            processing: true,

            serverSide: true,

            ajax: {
                url: datatableConfig.ajaxUrl,

                type: 'GET',

                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },

                dataSrc: function (json: any) {
                    // console.log('DataTables ajax response:', json); // Debug için açabilirsin

                    return json.data || json;
                },

                error: function (xhr: any, error: any, thrown: any) {
                    console.error('Ajax Error:', xhr.responseText, error, thrown);

                    if (typeof window.Swal !== 'undefined') {
                        window.Swal.fire('Hata!', 'Veri yüklenirken bir sorun oluştu.', 'error');
                    } else {
                        alert('Hata! Veri yüklenirken bir sorun oluştu.');
                    }
                },
            },

            columns: datatableConfig.columns.map((col) => {
                // DataTables'ın beklediği kolon formatına dönüştür

                const dtCol: any = {
                    data: col.data,

                    name: col.name,

                    title: col.title,

                    orderable: col.orderable,

                    searchable: col.searchable,

                    className: col.className || '',
                };

                // Özel render fonksiyonlarını uygula

                if (col.name === 'select_checkbox') {
                    dtCol.render = function (data: any, type: string, row: any) {
                        return `<input type="checkbox" class="form-checkbox" value="${row.id || ''}">`;
                    };

                    dtCol.className = 'select-checkbox';

                    dtCol.orderable = false;

                    dtCol.searchable = false;

                    dtCol.data = null; // select_checkbox'ın data kaynağı yok
                } else if (col.name === 'published_at') {
                    dtCol.render = window.GorlabsDatatables.date('YYYY-MM-DD HH:mm');
                } else if (col.name === 'is_published') {
                    dtCol.render = window.GorlabsDatatables.statusBadge('Yayınlandı', 'Taslak');
                } else if (col.name === 'status') {
                    // Eğer 'status' sütunu da varsa

                    dtCol.render = window.GorlabsDatatables.statusBadge('Yayınlandı', 'Taslak');
                } else if (col.name === 'actions') {
                    dtCol.data = null; // actions'ın data kaynağı yok

                    dtCol.defaultContent = '';

                    dtCol.orderable = false;

                    dtCol.searchable = false;

                    // Render fonksiyonunu DataTables'ın render context'inde çalıştır

                    dtCol.render = window.GorlabsDatatables.actions(datatableConfig.updateUrlPrefix, datatableConfig.deleteUrlPrefix);
                }

                return dtCol;
            }),

            order: [[1, 'desc']], // Varsayılan sıralama: ID'ye göre azalan

            pageLength: datatableConfig.perPage,

            lengthMenu: datatableConfig.perPageSelect,

            responsive: datatableConfig.responsive, // <-- Burası zaten true

            dom: '<"flex flex-col sm:flex-row justify-between items-center mb-4"lfB><"overflow-x-auto"rt><"flex flex-col sm:flex-row justify-between items-center mt-4"ip>', // DOM yapısını config'den alabiliriz veya buraya yazabiliriz

            buttons: [
                'copy',
                'excel',
                'csv',
                'pdf',
                'print',

                {
                    text: datatableConfig.addNewButtonText,

                    className: 'bg-blue-500 text-white px-5 py-2 rounded shadow hover:bg-blue-600 transition',

                    attr: {
                        'data-dusk': 'add-new-post-button',
                    },

                    action: () => {
                        window.openFormModal(datatableConfig.addNewButtonText, datatableConfig.addEditUrl, null);
                    },
                },
            ],

            initComplete: function (_settings: any, _json: any) {
                console.log('DataTables initComplete.');

                // `this` burada DataTables API'sidir.

                ($(this.api().table().node()) as any).css('visibility', 'visible');
            },
        });

        // DataTables yeniden yükleme olayını dinle

        window.addEventListener('datatable-reload', () => {
            if (dataTableInstance.value) {
                console.log('datatable-reload event received. Reloading DataTable.');

                dataTableInstance.value.ajax.reload(null, false);
            }
        });

        // Alpine.js global modal olaylarını dinle

        document.addEventListener('edit-item', (event: CustomEvent) => {
            const item = event.detail;

            console.log('Edit item event received:', item);

            const url = route('posts.edit', { post: item.id }); // Ziggy ile doğru rota

            const title = `Edit Post: ${item.title || item.id}`;

            window.openFormModal(title, url, item);
        });

        document.addEventListener('delete-item', (event: CustomEvent) => {
            const itemId = event.detail.id;

            console.log('Delete item event received for ID:', itemId);

            if (typeof window.Swal !== 'undefined') {
                window.Swal.fire({
                    title: 'Emin misiniz?',

                    text: 'Bu öğeyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz!',

                    icon: 'warning',

                    showCancelButton: true,

                    confirmButtonColor: '#d33',

                    cancelButtonColor: '#3085d6',

                    confirmButtonText: 'Yes, Delete!',

                    cancelButtonText: 'Exit',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            const url = route('posts.destroy', { post: itemId }); // Ziggy ile doğru rota

                            const response = await fetch(url, {
                                method: 'DELETE',

                                headers: {
                                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',

                                    Accept: 'application/json',

                                    'Content-Type': 'application/json',
                                },
                            });

                            if (!response.ok) {
                                const errorData = await response.json();

                                throw new Error(errorData.message || `Silme işlemi başarısız oldu. HTTP Status: ${response.status}`);
                            }

                            const data = await response.json();

                            window.Swal.fire('Silindi!', data.success, 'success');

                            if (dataTableInstance.value) {
                                dataTableInstance.value.ajax.reload(null, false);
                            }
                        } catch (error: any) {
                            console.error('Silme işlemi sırasında hata:', error);

                            window.Swal.fire('Hata!', error.message || 'Silme işlemi sırasında bilinmeyen bir hata oluştu.', 'error');
                        }
                    }
                });
            } else {
                console.warn('SweetAlert2 (Swal) tanımlı değil. Silme onayı işlevi eksik.');

                // Swal yoksa doğrudan silme işlemini tetikleyebiliriz, ancak onay almadan riskli

                // window.dispatchEvent(new CustomEvent('submit-delete-item', { detail: { id: itemId } }));
            }
        });
    });
</script>

<template>
    <Head title="Posts" />

    <AuthenticatedLayout>
        <template #header>
            <h2 class="text-xl font-semibold leading-tight text-gray-800">Posts</h2>
        </template>

        <div class="py-12">
            <div class="mx-auto max-w-7xl sm:px-1 lg:px-1">
                <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div class="p-3 text-gray-900">
                        <div class="test-red-background">Bu bir test.</div>
                        <h2 class="mb-4 text-2xl text-xl font-semibold leading-tight text-gray-800">Posts Listesi</h2>
                        <div ref="dataTableContainer" class="">
                            <table id="posts-table" class="min-w-full divide-y divide-gray-200 dark:divide-gray-700" style="width: 100%">
                                <thead class="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <!-- Kolon başlıkları dinamik olarak props'tan oluşturulacak -->

                                    <th
                                        v-for="column in datatableConfig.columns"
                                        :key="column.name"
                                        scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                        v-html="column.title"
                                    ></th>
                                </tr>
                                </thead>

                                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                <!-- DataTables ajax ile doldurulacak -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Paketten gelen modal şablonunu dahil et --> 

            <div
                x-data="globalModal()"
                x-show="open"
                x-transition:enter="transition ease-out duration-300"
                x-transition:enter-start="opacity-0"
                x-transition:enter-end="opacity-100"
                x-transition:leave="transition ease-in duration-200"
                x-transition:leave-start="opacity-100"
                x-transition:leave-end="opacity-0"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                @keydown.escape.window="closeModal"
            >
                <div
                    class="relative max-h-full w-full max-w-4xl overflow-auto rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900"
                    @click.away="closeModal"
                >
                    <h2 class="mb-4 text-xl font-semibold" x-text="title"></h2>

                    <div id="modal-content"></div>

                    <button
                        class="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        @click="closeModal"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

<style scoped></style>



```
4. Vue, Inertia.js ve Tailwind CSS Kurulumu
   Öncelikle, Laravel Breeze veya benzeri bir yolla Inertia.js ve Vue'yu projenize dahil etmelisiniz. Eğer henüz yapmadıysanız:



tsconfig.json Dosyasını Güncelleme
Yeni Laravel projenizde TypeScript'in DataTables, jQuery ve diğer global olarak erişilebilir kütüphaneleri doğru bir şekilde tanıması için tsconfig.json dosyanızda aşağıdaki değişiklikleri yapmanız gerekmektedir. Bu değişiklikler, tip tanımlamalarının doğru bir şekilde bulunmasını ve derleyici hatalarını önlemeyi sağlar.

Aşağıdaki maddeleri tsconfig.json dosyanızdaki compilerOptions objesi altına ekleyin veya mevcut değerleri bunlarla değiştirin:

```json
{
    "compilerOptions": {
         
        "lib": [
            "ES2021", //  Ekleyin
            "ESNext",
            "DOM",
            "DOM.Iterable"
        ],
        // önündeki // işaretlerinş kaldırın ve içini düzenleyin
        "typeRoots": [
            "./node_modules/@types",
            "./resources/js/types" // Global type tanımlamalarınızın olduğu dizini ekleyin
        ],
        // types array'ini DataTables ve jQuery tipleriyle güncelleyin
        "types": [
            "vite/client",
            "./resources/js/types",  
            "jquery",  
            "node"  
        ],

        // ... (Mevcut diğer compilerOptions ayarları)
    },
    // "include" bölümünün de aşağıdaki gibi olduğundan emin olun (mevcut dosyanızda zaten böyleyse karışmayın):
    "include": [
        "resources/js/**/*.ts",
        "resources/js/**/*.d.ts", // .d.ts dosyalarının dahil edildiğinden emin olun
        "resources/js/**/*.tsx",
        "resources/js/**/*.vue"
    ]
}
```


resources/views/app.blade.php içeriğini düzeltin
```php
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @vite(['resources/js/app.js', "resources/js/Pages/{$page['component']}.vue"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html> 
```


tailwindconfig.js  eğer yoksa
```bash
touch tailwind.config.js
```
tailwind.config.js içeriğini düzenleyin

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



5. Tailwind CSS Ayarları app.css içinde
   resources/css/app.css dosyasının içeriğini aşağıdaki gibi güncelleyin. Bu dosya zaten mevcut olmalıdır.

```css
@import 'datatables.net-responsive-dt/css/responsive.dataTables.css';
@import '../css/datatables-tailwind.css';
@import 'tailwindcss';


/* Test için eklenen kısım */

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
Route Tanımları
routes/web.php dosyasını açın ve aşağıdaki rota tanımlarını ekleyin:

```php
<?php

use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

//Mevcut rotalarınız 
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    // PostController için rotalar
    
    // Inertia tarafından render edilecek Post listesi sayfası
    Route::resource('posts', \App\Http\Controllers\PostController::class); 
    // DataTables'ın AJAX istekleriyle veri alacağı API endpoint'i de aynı index metodu üzerinden yönetilecek.
    Route::get('/posts-data', [\App\Http\Controllers\PostController::class, 'ajaxData'])->name('posts.data');
});

```
Veri tabanı bağlantınızı kontrol edin .env den

```bash

php artisan migrate:fresh --seed
```

```bash 

composer update 
composer dump-autoload
php artisan optimize:clear 
npm cache verify
rm -rf node_modules yarn.lock package-lock.json
rm -rf public/build 
npm install @alpinejs/collapse @alpinejs/focus @alpinejs/persist @alpinejs/ui @tailwindcss/postcss alpinejs class-variance-authority clsx concurrently dayjs jszip pdfmake postcss-loader sweetalert2 tailwind-merge tw-animate-css
npm install --save-dev @types/alpinejs @types/jquery @types/pdfmake datatables.net datatables.net-buttons datatables.net-buttons-dt datatables.net-dt datatables.net-responsive datatables.net-responsive-dt jquery postcss
php artisan optimize:clear 
npm cache verify
npm run dev
```
  
Bu rehberde Laravel + Vue + Tailwind DataTables projesinin kurulumu ve temel dosyaların içeriği yer almaktadır. Herhangi bir sorunuz olursa lütfen iletişime geçin.
