// CSS dosyasını bu JS modülünden import ediyoruz.
// import '../css/datatables-tailwind.css';
import { postForm } from './post-form';
// Diğer bağımlılıklar (Day.js, jQuery, SweetAlert) genellikle ana app.js'te global olarak tanımlandığı için burada tekrar import edilmeleri şart değil.
import dayjs from 'dayjs';


// GorlabsDatatables global nesnesini ve satır verilerini saklamak için bir alan oluşturun
window.GorlabsDatatables = window.GorlabsDatatables || {};
window.GorlabsDatatables.rowData = window.GorlabsDatatables.rowData || {};

/**
 * Tarih formatlama için render fonksiyonu.
 */
window.GorlabsDatatables.date = function (format = 'YYYY-MM-DD') {
    return function (data, type, row, meta) {
        if (type === 'display' && data) {
            if (typeof dayjs !== 'undefined') {
                return dayjs(data).format(format);
            }
            return data;
        }
        return data;
    };
};

/**
 * Durum için badge/rozet render fonksiyonu.
 */
window.GorlabsDatatables.statusBadge = function (trueText = 'Yayınlandı', falseText = 'Taslak') {
    return function (data, type, row, meta) {
        if (type === 'display') {
            const isTrue = data === 1 || data === true || data === 'true';
            const bgColor = isTrue ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
            const text = isTrue ? trueText : falseText;
            return `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}">${text}</span>`;
        }
        return data;
    };
};

/**
 * Resim önizlemesi için render fonksiyonu.
 */
window.GorlabsDatatables.image = function (options = {}) {
    const defaultOptions = {
        width: '50px',
        height: '50px',
        class: 'rounded-full object-cover',
        default: 'https://via.placeholder.com/50'
    };
    const finalOptions = { ...defaultOptions, ...options };

    return function (data, type, row, meta) {
        if (type === 'display') {
            const imageUrl = data || finalOptions.default;
            return `<img src="${imageUrl}" alt="Image" class="${finalOptions.class}" style="width:${finalOptions.width}; height:${finalOptions.height};">`;
        }
        return data;
    };
};

/**
 * Metin kısaltma için render fonksiyonu.
 */
window.GorlabsDatatables.truncateText = function (maxLength = 50) {
    return function (data, type, row, meta) {
        if (type === 'display' && data && data.length > maxLength) {
            return `<span title="${data}">${data.substr(0, maxLength)}...</span>`;
        }
        return data;
    };
};

/**
 * Eylem (Edit/Delete) butonları için render fonksiyonu.
 */
window.GorlabsDatatables.actions = function (updateUrlPrefix, deleteUrlPrefix) {
    return function (data, type, row, meta) {
        if (!row || typeof row.id === 'undefined') {
            return '';
        }
        window.GorlabsDatatables.rowData[row.id] = row;

        const editButton = `
            <button id="edit-btn-${row.id}" data-dusk="edit-btn-${row.id}"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    @click.stop="$dispatch('edit-item', window.GorlabsDatatables.rowData[${row.id}])">
                Edit
            </button>`;

        const deleteButton = `
            <button id="delete-btn-${row.id}" data-dusk="delete-btn-${row.id}"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-2"
                    @click.stop="$dispatch('delete-item', { id: ${row.id} })">
                Delete
            </button>`;

        return `<div class="flex">${editButton}${deleteButton}</div>`;
    };
};

export function registerGorlabsDatatablesAlpineComponents(AlpineInstance) {
    if (typeof AlpineInstance === 'undefined' || AlpineInstance === null) {
        console.error("CRITICAL ERROR: Alpine.js instance was not provided to registerGorlabsDatatablesAlpineComponents. DataTables components will not function.");
        return;
    }
    AlpineInstance.data('postForm', postForm)

    AlpineInstance.store('modalData', {
        open: false,
        title: '',
        bodyUrl: '',
        form: { // Bu 'form' objesi, postForm bileşeninin 'initialPostData' parametresi olarak kullanılacak.
            id: null,
            title: '',
            content: '',
            is_published: false,
            // Yeni kayıt için varsayılan tarih, güncel zamanı kullanabiliriz
            published_at: dayjs().format('YYYY-MM-DDTHH:mm'),
        },
        initialFormState: { // Formu sıfırlamak için kullanılır
            id: null,
            title: '',
            content: '',
            is_published: false,
            published_at: dayjs().format('YYYY-MM-DDTHH:mm'),
        }
    });

    AlpineInstance.data('globalModal', () => ({
        open: false,
        title: '',
        size: 'max-w-4xl',

        init() {
            window.addEventListener('close-modal', () => {
                this.closeModal();
            });
            this.$watch('$store.modalData.open', (value) => {
                this.open = value;
                if (value) {
                    document.body.classList.add('overflow-hidden');
                } else {
                    document.body.classList.remove('overflow-hidden');
                }
            });
            this.$watch('$store.modalData.title', (value) => {
                this.title = value;
            });
        },
        closeModal() {
            AlpineInstance.store('modalData').open = false;
            document.body.classList.remove('overflow-hidden');
            window.dispatchEvent(new CustomEvent('modal-closed'));
            // Modalı kapatırken formu initialFormState'e sıfırla
            AlpineInstance.store('modalData').form = { ...AlpineInstance.store('modalData').initialFormState };
        }
    }));

    window.openFormModal = async (title, url, item = null) => {
        console.log('openFormModal çağrıldı:', title, url, item);
        AlpineInstance.store('modalData').title = title;
        AlpineInstance.store('modalData').open = true;
        console.log('modalData.open set edildi:', AlpineInstance.store('modalData').open);

        // **ÖNEMLİ DEĞİŞİKLİK BURADA:**
        // `item` varsa, `modalData.form`'u `item` ile doldur.
        // `item` yoksa (yani yeni kayıt), `initialFormState`'i kullan.
        // `published_at` alanını `post-form.js`'in kendi içinde işlemesine izin veriyoruz.
        const dataToSet = item ? { ...item } : { ...AlpineInstance.store('modalData').initialFormState };

        // Yeni kayıt oluşturulurken published_at varsayılan olarak bugün ve şimdi olsun.
        // Eğer `item` varsa, `item.published_at` değeri zaten gelmiş olacak ve `post-form.js` onu işleyecek.
        if (!item) {
            dataToSet.published_at = dayjs().format('YYYY-MM-DDTHH:mm');
        } else {
            // Edit işlemiyse, published_at'ın doğru formatta gelmesini sağla.
            // Örneğin, "2025-07-03 20:36:00" -> "2025-07-03T20:36"
            if (dataToSet.published_at && dayjs(dataToSet.published_at).isValid()) {
                dataToSet.published_at = dayjs(dataToSet.published_at).format('YYYY-MM-DDTHH:mm');
            } else {
                dataToSet.published_at = ''; // Geçersizse boş bırak
            }
        }

        AlpineInstance.store('modalData').form = dataToSet;
        console.log('modalData.form güncellendi:', AlpineInstance.store('modalData').form); // Debug log

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Modal içeriği yüklenemedi. HTTP Status: ${response.status}`);
            }
            const html = await response.text();

            const modalContentArea = document.getElementById('modal-content');
            if (!modalContentArea) {
                console.error('Hata: Modal içeriğinin yükleneceği div bulunamadı! ID: modal-content');
                throw new Error('Modal içeriğinin yükleneceği div bulunamadı!');
            }
            modalContentArea.innerHTML = html;

            // Alpine.js'in yeni yüklenen içeriği işlemesini sağlamak için setTimeout kullanın
            setTimeout(() => {
                AlpineInstance.initTree(modalContentArea);
                console.log("Alpine.js initTree called for modal content.");
            }, 0); // 0ms gecikme ile bir sonraki event döngüsünde çalıştır

        } catch (error) {
            console.error("Caught error in openFormModal:", error);

            const errorMessage = typeof error === 'object' && error !== null && error.message
                ? error.message
                : String(error);

            if (typeof Swal !== 'undefined') {
                Swal.fire('Hata!', errorMessage || 'Modal içeriği yüklenirken bilinmeyen bir sorun oluştu.', 'error');
            } else {
                alert('Hata! ' + (errorMessage || 'Modal içeriği yüklenirken bilinmeyen bir sorun oluştu.'));
            }
            AlpineInstance.store('modalData').open = false;
        }
    };

    AlpineInstance.data('app', () => ({
        init() {
            this.$el.addEventListener('edit-item', (event) => {
                const item = event.detail;
                console.log('Edit item event received:', item);
                const url = `/posts/${item.id}/edit`;
                const title = `Edit Post: ${item.title || item.id}`;
                // openFormModal'a doğrudan item objesini geçirin
                window.openFormModal(title, url, item);
            });

            this.$el.addEventListener('delete-item', (event) => {
                const itemId = event.detail.id;
                console.log('Delete item event received for ID:', itemId);

                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: 'Emin misiniz?',
                        text: "Bu öğeyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#3085d6',
                        confirmButtonText: 'Evet, Sil!',
                        cancelButtonText: 'İptal'
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            try {
                                const url = `/posts/${itemId}`;
                                const response = await fetch(url, {
                                    method: 'DELETE',
                                    headers: {
                                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    }
                                });

                                if (!response.ok) {
                                    const errorData = await response.json();
                                    throw new Error(errorData.message || `Silme işlemi başarısız oldu. HTTP Status: ${response.status}`);
                                }

                                const data = await response.json();
                                Swal.fire('Silindi!', data.success, 'success');

                                window.dispatchEvent(new CustomEvent('datatable-reload'));

                            } catch (error) {
                                console.error('Silme işlemi sırasında hata:', error);
                                const errorMessage = typeof error === 'object' && error !== null && error.message
                                    ? error.message
                                    : String(error);
                                Swal.fire('Hata!', errorMessage || 'Silme işlemi sırasında bilinmeyen bir hata oluştu.', 'error');
                            }
                        }
                    });
                } else {
                    console.warn("SweetAlert2 (Swal) tanımlı değil. Silme onayı işlevi eksik.");
                    window.dispatchEvent(new CustomEvent('submit-delete-item', { detail: { id: itemId } }));
                }
            });
        }
    }));

    AlpineInstance.data('deleteItem', () => ({
        init() {
            window.addEventListener('delete-item', (event) => {
                const { id } = event.detail;
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: 'Emin misiniz?',
                        text: 'Bu kaydı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#EF4444',
                        cancelButtonColor: '#6B7280',
                        confirmButtonText: 'Evet, sil!',
                        cancelButtonText: 'İptal'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.dispatchEvent(new CustomEvent('submit-delete-item', {
                                detail: { id: id }
                            }));
                        }
                    });
                } else {
                    console.warn("SweetAlert2 (Swal) tanımlı değil. Silme onayı işlevi eksik.");
                    window.dispatchEvent(new CustomEvent('submit-delete-item', { detail: { id: id } }));
                }
            });
        }
    }));

    AlpineInstance.data('crudDataTable', (config) => {
        return {
            datatableId: config.datatableId,
            ajaxUrl: config.ajaxUrl,
            columnsConfig: config.columns,
            perPage: config.perPage || 10,
            perPageSelect: config.perPageSelect || [10, 25, 50, 100, -1],
            addNewButtonText: config.addNewButtonText || 'Add New',
            addEditUrl: config.addEditUrl,
            updateUrlPrefix: config.updateUrlPrefix,
            deleteUrlPrefix: config.deleteUrlPrefix,
            initialFormState: config.initialFormState || {},
            currentForm: {},
            dataTableInstance: null,

            init() {
                console.log('crudDataTable: Alpine component init called for ID:', this.datatableId);
                AlpineInstance.nextTick(() => {
                    console.log('crudDataTable: Alpine nextTick executed for ID:', this.datatableId);
                    this.initializeDataTable();
                });

                window.addEventListener('submit-delete-item', (event) => {
                    this.deleteItem(event.detail.id);
                });

                window.addEventListener('datatable-reload', () => {
                    if (this.dataTableInstance) {
                        console.log('crudDataTable: datatable-reload event received. Reloading DataTable for ID:', this.datatableId);
                        this.dataTableInstance.ajax.reload(null, false);
                    }
                });
            },
            initializeDataTable() {
                console.log('crudDataTable: initializeDataTable called for ID:', this.datatableId);
                const tableElement = $('#' + this.datatableId);
                console.log('crudDataTable: tableElement found for ID:', this.datatableId, 'Length:', tableElement.length);

                if (tableElement.length === 0) {
                    console.error('DataTables için HTML tablosu bulunamadı! ID:', this.datatableId, 'Ensure table element is present in DOM when x-data is initialized.');
                    return;
                }

                if (!Array.isArray(this.columnsConfig)) {
                    console.error('CRITICAL ERROR: columnsConfig bir array değil veya undefined! Güncel değer:', this.columnsConfig, 'Type:', typeof this.columnsConfig);
                    return;
                }
                if (this.columnsConfig.length === 0) {
                    console.error('CRITICAL ERROR: columnsConfig arrayi boş! DataTables için kolon bilgisi yok.');
                    return;
                }

                const dtColumns = this.columnsConfig.map((col, index) => {
                    if (col === undefined || col === null || typeof col !== 'object' || (!('name' in col) && col.type !== 'checkbox')) {
                        console.error(`CRITICAL ERROR: columnsConfig içinde geçersiz kolon objesi bulundu! Index: ${index}, object:`, col);
                        return null;
                    }

                    const dtCol = {
                        data: col.name,
                        name: col.name,
                        title: col.title,
                        orderable: col.orderable,
                        searchable: col.searchable,
                        className: col.className || '',
                    };
                    if (col.name === 'select_checkbox') {
                        dtCol.render = function (data, type, row) {
                            return `<input type="checkbox" class="form-checkbox" value="${row.id || ''}">`;
                        };
                        dtCol.className = 'select-checkbox';
                        dtCol.orderable = false;
                        dtCol.searchable = false;
                        dtCol.data = null;
                    } else if (col.name === 'published_at') {
                        dtCol.render = window.GorlabsDatatables.date("YYYY-MM-DD HH:mm");
                    } else if (col.name === 'is_published') {
                        dtCol.render = window.GorlabsDatatables.statusBadge("Yayınlandı", "Taslak");
                    } else if (col.name === 'status') {
                        dtCol.render = window.GorlabsDatatables.statusBadge("Yayınlandı", "Taslak");
                    } else if (col.name === 'actions') {
                        dtCol.data = null;
                        dtCol.defaultContent = '';
                        dtCol.orderable = false;
                        dtCol.searchable = false;
                        // Render fonksiyonunu DataTables'ın render context'inde çalıştır
                        dtCol.render = window.GorlabsDatatables.actions(this.updateUrlPrefix, this.deleteUrlPrefix);
                    }
                    return dtCol;
                }).filter(col => col !== null);

                if (dtColumns.length === 0) {
                    console.error('CRITICAL ERROR: dtColumns arrayi oluşturulduktan sonra boş kaldı. Kolon yapılandırmasını kontrol edin.');
                    return;
                }

                if ($.fn.DataTable.isDataTable(tableElement)) {
                    console.log('crudDataTable: DataTable already initialized for ID:', this.datatableId, '. Reloading...');
                    this.dataTableInstance.ajax.reload(null, false);
                    return;
                }

                try {
                    this.dataTableInstance = tableElement.DataTable({
                        processing: true,
                        serverSide: true,
                        dom: '<"flex flex-col sm:flex-row justify-between items-center mb-4"lfB><"overflow-x-auto"rt><"flex flex-col sm:flex-row justify-between items-center mt-4"ip>',
                        buttons: [
                            'copy', 'excel', 'csv', 'pdf', 'print',
                            {
                                text: this.addNewButtonText,
                                className: 'bg-blue-500 text-white px-5 py-2 rounded shadow hover:bg-blue-600 transition',
                                attr: {
                                    'data-dusk': 'add-new-post-button'
                                },
                                action: () => {
                                    this.openFormModal();
                                }
                            }
                        ],
                        ajax: {
                            url: this.ajaxUrl,
                            type: 'GET',
                            headers: {
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                            },
                            data: function (d) {
                                // DataTables'ın AJAX isteği göndermeden önceki verisi
                                console.log('DataTables AJAX request data (d):', d);
                                for (var i = 0, len = d.columns.length; i < len; i++) {
                                    if (!d.columns[i].search.value) delete d.columns[i].search;
                                }
                                if (d.search && d.search.regex !== undefined) delete d.search.regex;
                            },
                            dataSrc: function(json) {
                                console.log('DataTables ajax response:', json);
                                return json.data || json;
                            },
                            error: function(xhr, error, thrown) {
                                console.error("Ajax Error:", xhr.responseText, error, thrown);
                                if (typeof Swal !== 'undefined') {
                                    Swal.fire('Hata!', 'Veri yüklenirken bir sorun oluştu.', 'error');
                                } else {
                                    alert('Hata! Veri yüklenirken bir sorun oluştu.');
                                }
                            }
                        }
                        ,
                        columns: dtColumns,
                        order: [[1, 'desc']],
                        pageLength: this.perPage,
                        responsive: true,
                        initComplete: function(settings, json) {
                            console.log('crudDataTable: DataTables initComplete for ID:', this.datatableId);
                            // `this` burada DataTables API'sidir.
                            $(this.api().table().node()).css('visibility', 'visible');
                        },
                    });
                    console.log('crudDataTable: DataTables initialized successfully for ID:', this.datatableId);
                } catch (e) {
                    console.error('crudDataTable: Error initializing DataTables for ID:', this.datatableId, e);
                }
            },
            openFormModal(item = null) {
                let title;
                let url;

                if (item) {
                    title = 'Edit Post';
                    url = `${this.updateUrlPrefix}/${item.id}/edit`;
                } else {
                    title = 'Create New Post';
                    url = this.addEditUrl;
                }
                window.openFormModal(title, url, item);
            },
            deleteItem(id) {
                const deleteUrl = `${this.deleteUrlPrefix}/${id}`;
                fetch(deleteUrl, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(errorData => {
                                throw new Error(errorData.message || 'Silme işleminde bir hata oluştu.');
                            });
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.success) {
                            if (typeof Swal !== 'undefined') {
                                Swal.fire('Başarılı!', data.success, 'success');
                            } else {
                                alert('Başarılı! ' + data.success);
                            }
                            this.dataTableInstance.ajax.reload(null, false);
                        } else {
                            if (typeof Swal !== 'undefined') {
                                Swal.fire('Hata!', data.message || 'Kayıt silinirken bir sorun oluştu.', 'error');
                            } else {
                                alert('Hata! ' + (data.message || 'Kayıt silinirken bir sorun oluştu.'));
                            }
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        if (typeof Swal !== 'undefined') {
                            Swal.fire('Hata!', 'Kayıt silinirken bir ağ hatası oluştu veya sunucu hatası: ' + error.message, 'error');
                        } else {
                            alert('Hata! Kayıt silinirken bir ağ hatası oluştu veya sunucu hatası: ' + error.message);
                        }
                    });
            },
        };
    });
}
// KRİTİK: Bu fonksiyonu global window.GorlabsDatatables objesine ata
// Bu satır crud-datatable.js dosyasının en sonunda olmalı!
window.GorlabsDatatables.registerGorlabsDatatablesAlpineComponents = registerGorlabsDatatablesAlpineComponents;
