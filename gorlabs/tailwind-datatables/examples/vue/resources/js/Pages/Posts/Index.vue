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
<!--                        &times;-->
                    </button>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>

<style scoped></style>
