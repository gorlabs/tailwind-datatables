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
