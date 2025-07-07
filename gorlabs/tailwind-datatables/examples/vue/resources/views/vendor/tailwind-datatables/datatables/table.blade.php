<div {{ $attributes->except('class') }}>
    {!! $dataTable->table(['class' => $attributes->get('class', 'table datatable text-nowrap w-full')]) !!}
</div>
