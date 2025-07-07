* [Gorlabs Tailwind Datatable Main Page](../../README.md)
# Laravel + Vue + Tailwind DataTables Installation Guide

This guide provides step-by-step instructions for creating a Laravel project, setting up Vue and Inertia.js, and installing and configuring the `gorlabs/tailwind-datatables` package.

---

## 1. Creating a Laravel Project

First, create a new Laravel project. Please start your project development with this step; it's crucial for everything to begin with a correct setup:

```bash
laravel new gorlabs-datatable-vue && cd gorlabs-datatable-vue && composer require laravel/breeze --dev && touch resources/js/bootstrap.js && php artisan breeze:install vue &&  rm resources/js/app.ts && rm vite.config.ts && rm -rf resources/js/pages
 

```
Fixing package.json Clutter

The package.json file that comes with a fresh Laravel-Vue stack installation is clean and organized. However, when you run the breeze:install vue command, this scaffolding unfortunately breaks the existing structure. Our installation script already mitigates most of the damage caused by this addition, but now you need to clean up your package.json file because it has been cluttered by the breeze:install vue command and will cause conflicts.

At this stage, your package.json file should look like this:

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

2. Composer Package Installation

```bash
composer require gorlabs/tailwind-datatables
```
Publish the package assets:

```bash

composer update

php artisan vendor:publish --tag=tailwind-datatables-views
php artisan vendor:publish --tag=gorlabs-tailwind-datatables-config 
php artisan vendor:publish --tag=tailwind-datatables-css
```

Next, update the content of the resources/js/app.js file as shown below. This file should already exist.
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
import 'datatables.net-buttons/js/buttons.html5.js'; 
import 'datatables.net-buttons/js/buttons.print.js'; 
import 'datatables.net-buttons/js/buttons.colVis.js'; 
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
// New Section to Add: Wait for Alpine.js to load and register components
// This event listener fires when Alpine.js is loaded from CDN and ready.
registerGorlabsDatatablesAlpineComponents(Alpine); // Bileşenleri kaydet
Alpine.start();



```
Update postcss.config.js content
```js
export default {
    plugins: {
        '@tailwindcss/postcss': {},
        autoprefixer: {},
    },
};
```



6. Vite Configurations
   Update the content of the vite.config.js file as shown below. This file should already exist.
7. 
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
7. Update resources/js/types/global.d.ts content

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



8. PHP Backend Files
   Creating a Migration
   Create a migration file to set up the posts table and replace its content with the following:
```bash
php artisan make:migration create_posts_table
```

The generated file path will be: database/migrations/YYYY_MM_DD_HHMMSS_create_posts_table.php (where YYYY_MM_DD_HHMMSS will vary based on the date and time). Update its content as follows:
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

### Creating a Model
Create the Post model and PostFactory.php and replace their contents with the following:

```bash
php artisan make:model Post -f
```
The generated file path will be: app/Models/Post.php. Update its content as follows:

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
### The content of PostFactory.php should be as follows:

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

### Content of PostSeeder.php:

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

### DatabaseSeeder.php Content

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

### Creating the DataTable Class

Create the `PostsDataTable` class and replace its content with the following:

```bash
php artisan datatable:make PostsDataTable --model=Post
```

The generated file path will be: `app/DataTables/PostsDataTable.php`. Update its content as follows:

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

### Creating the Controller

Create the `PostController` class and replace its content with the following:

```bash
php artisan make:controller PostController
```
The generated file path will be: `app/Http/Controllers/PostController.php`. Update its content as follows:
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

### Vue Component

Create the `resources/js/Pages/Posts/Index.vue` file and replace its content with the following:

```bash
mkdir -p resources/js/Pages/Posts
touch resources/js/Pages/Posts/Index.vue
```

The generated file path will be: `resources/js/Pages/Posts/Index.vue`. Update its content as follows:

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

            className?: string; // The className option can be optional
        }>;
    }>();

    console.log('Props Columns:', props.columns);

    // Create a ref for DataTables' HTML structure

    const dataTableContainer = ref<HTMLElement | null>(null);

    // We're defining the crudDataTable config using the columns from props.

    const datatableConfig = {
        datatableId: 'posts-table',

        ajaxUrl: route('posts.data'),

        columns: props.columns, // We're getting the columns from props!

        perPage: 10,

        perPageSelect: [10, 25, 50, 100, -1],

        addNewButtonText: 'Add New Post',

        addEditUrl: route('posts.create'),

        updateUrlPrefix: route('posts.update', ''),

        deleteUrlPrefix: route('posts.destroy', ''),

        initialFormState: {},

        responsive: true, // The responsive feature is set to true here
    };

    // A ref to store the DataTables instance

    const dataTableInstance = ref<any>(null);

    const $ = window.$ as any;

    onMounted(() => {
        // Ensure jQuery and DataTables are globally available

        if (typeof window.$ === 'undefined' || typeof (window.$ as any).fn.DataTable === 'undefined') {
            console.error('jQuery or DataTables is not available globally.');

            return;
        }

        // Check for the existence of GorlabsDatatables

        if (typeof window.GorlabsDatatables === 'undefined') {
            console.error('GorlabsDatatables is not available globally.');

            return;
        }

        // Initialize DataTables

        // We're preventing TypeScript from overloading the jQuery type by using 'as any'

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
                    // console.log('DataTables ajax response:', json); // You can uncomment this for debugging

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
                // Convert to the column format expected by DataTables

                const dtCol: any = {
                    data: col.data,

                    name: col.name,

                    title: col.title,

                    orderable: col.orderable,

                    searchable: col.searchable,

                    className: col.className || '',
                };

                // Apply custom render functions

                if (col.name === 'select_checkbox') {
                    dtCol.render = function (data: any, type: string, row: any) {
                        return `<input type="checkbox" class="form-checkbox" value="${row.id || ''}">`;
                    };

                    dtCol.className = 'select-checkbox';

                    dtCol.orderable = false;

                    dtCol.searchable = false;

                    dtCol.data = null; // select_checkbox has no data source
                } else if (col.name === 'published_at') {
                    dtCol.render = window.GorlabsDatatables.date('YYYY-MM-DD HH:mm');
                } else if (col.name === 'is_published') {
                    dtCol.render = window.GorlabsDatatables.statusBadge('Yayınlandı', 'Taslak');
                } else if (col.name === 'status') {  
                    dtCol.render = window.GorlabsDatatables.statusBadge('Yayınlandı', 'Taslak');
                } else if (col.name === 'actions') {
                    dtCol.data = null; // actions have no data source

                    dtCol.defaultContent = '';

                    dtCol.orderable = false;

                    dtCol.searchable = false;

                    // Run the render function within DataTables' render context

                    dtCol.render = window.GorlabsDatatables.actions(datatableConfig.updateUrlPrefix, datatableConfig.deleteUrlPrefix);
                }

                return dtCol;
            }),

            order: [[1, 'desc']], // Default sorting: ID in descending order

            pageLength: datatableConfig.perPage,

            lengthMenu: datatableConfig.perPageSelect,

            responsive: datatableConfig.responsive, 

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

                // `this` here is the DataTables API.

                ($(this.api().table().node()) as any).css('visibility', 'visible');
            },
        });

        // Listen for the DataTables reload event

        window.addEventListener('datatable-reload', () => {
            if (dataTableInstance.value) {
                console.log('datatable-reload event received. Reloading DataTable.');

                dataTableInstance.value.ajax.reload(null, false);
            }
        });

        // Listen for Alpine.js global modal events

        document.addEventListener('edit-item', (event: CustomEvent) => {
            const item = event.detail;

            console.log('Edit item event received:', item);

            const url = route('posts.edit', { post: item.id }); // The correct route with Ziggy

            const title = `Edit Post: ${item.title || item.id}`;

            window.openFormModal(title, url, item);
        });

        document.addEventListener('delete-item', (event: CustomEvent) => {
            const itemId = event.detail.id;

            console.log('Delete item event received for ID:', itemId);

            if (typeof window.Swal !== 'undefined') {
                window.Swal.fire({
                    title: 'Are you sure?',

                    text: 'Are you sure you want to delete this item? This action cannot be undone!',

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

                                throw new Error(errorData.message || `The delete operation failed.. HTTP Status: ${response.status}`);
                            }

                            const data = await response.json();

                            window.Swal.fire('Deleted!', data.success, 'success');

                            if (dataTableInstance.value) {
                                dataTableInstance.value.ajax.reload(null, false);
                            }
                        } catch (error: any) {
                            console.error('Error during deletion.:', error);

                            window.Swal.fire('Error!', error.message || 'An unknown error occurred during the deletion process.', 'error');
                        }
                    }
                });
            } else {
                console.warn('SweetAlert2 (Swal) is not defined. The delete confirmation function is missing.');

                // If Swal isn't available, we could trigger the delete directly, but it's risky without confirmation.

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

            <!-- Include the modal template from the package --> 

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
### Vue, Inertia.js, and Tailwind CSS Installation
First, you need to include Inertia.js and Vue in your project, typically by using Laravel Breeze or a similar method. If you haven't done so already:

## Updating the tsconfig.json File
To ensure your new Laravel project's TypeScript correctly recognizes DataTables, jQuery, and other globally accessible libraries, you'll need to make the following changes in your tsconfig.json file. These modifications help TypeScript find the correct type definitions and prevent compiler errors.

Add the following entries under the compilerOptions object in your tsconfig.json file, or replace existing values with these:
```json
{
    "compilerOptions": {
         
        "lib": [
            "ES2021", //  Add
            "ESNext",
            "DOM",
            "DOM.Iterable"
        ],
        // Sure, please provide the text you'd like me to edit and I'll remove the // comments and revise the content.
        "typeRoots": [
            "./node_modules/@types",
            "./resources/js/types" // Add the directory where your global type definitions are located.
        ],
        //Update the types array with DataTables and jQuery types.
        "types": [
            "vite/client",
            "./resources/js/types",  
            "jquery",  
            "node"  
        ],

        // ... (Other existing compilerOptions settings)
    },
    // Make sure the include section is also as follows (if it's already like this in your current file, don't change it):
    "include": [
        "resources/js/**/*.ts",
        "resources/js/**/*.d.ts", // Make sure the .d.ts files are included.
        "resources/js/**/*.tsx",
        "resources/js/**/*.vue"
    ]
}
```


### Correct the content of resources/views/app.blade.php.
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


If tailwind.config.js doesn't exist.
```bash
touch tailwind.config.js
```
### Edit the content of tailwind.config.js.

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
                    // ... Other shades of white. ...
                },
                // RGB format CSS variable reference for each color.
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
                    DEFAULT: 'rgb(var(--color-black) / <alpha-value>)',    
                    50: 'rgb(var(--color-black-50) / <alpha-value>)',  
                    // ...Other shades of black...
                },
                // Custom colors associated with DataTables.
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



### Tailwind CSS Settings in app.css
Update the content of the resources/css/app.css file as shown below. This file should already exist.
```css
@import 'datatables.net-responsive-dt/css/responsive.dataTables.css';
@import '../css/datatables-tailwind.css';
@import 'tailwindcss';
 

/* CSS variables for DataTables and other custom theme colors. */
:root {
    --color-primary-DEFAULT: 249 115 22;      /* #f97316 */
    --color-primary-light: 254 243 199;       /* #fef3c7 */
    --color-primary-dark-light: 249 115 22;   /* rgba(249,115,22,.15)*/

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

    /* DataTables custom colors (dt-primary) - RGB FORMAT SEPARATED BY SPACES*/
    --color-dt-primary-DEFAULT: 249 115 22;  /* #f97316 */
    --color-dt-primary-dark: 194 65 12;     /* #c2410c */
    --color-dt-primary-light: 253 186 116;   /* #fdba74 */
}

```
### Route Definitions
Open the routes/web.php file and add the following route definitions:

```php
<?php

use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

//Your existing routes.
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
### Check your database connection from .env

```bash

php artisan migrate:fresh --seed
```

```bash 


composer update 
composer dump-autoload
php artisan optimize:clear 
npm cache clean --force
rm -rf node_modules yarn.lock package-lock.json
rm -rf public/build 
npm install @alpinejs/collapse @alpinejs/focus @alpinejs/persist @alpinejs/ui @tailwindcss/postcss alpinejs class-variance-authority clsx concurrently dayjs jszip pdfmake postcss-loader sweetalert2 tailwind-merge tw-animate-css
npm install --save-dev @types/alpinejs @types/jquery @types/pdfmake datatables.net datatables.net-buttons datatables.net-buttons-dt datatables.net-dt datatables.net-responsive datatables.net-responsive-dt jquery postcss
php artisan optimize:clear 
npm cache clean --force
npm run dev
```

This guide covers the setup and basic file contents for a Laravel + Vue + Tailwind DataTables project. If you have any questions, please feel free to get in touch.
