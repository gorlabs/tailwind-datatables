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
