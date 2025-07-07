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
