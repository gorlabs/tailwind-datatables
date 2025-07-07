// /home/mehmet/Code/gorlabs-datatable/vendor/gorlabs/tailwind-datatables/resources/js/post-form.js
// Bu dosyayı küçük bir değişiklik ile güncelliyoruz!

import Alpine from 'alpinejs';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

// Alpine.data'ya kaydettiğimiz fonksiyonu bir değişkene atıyoruz ve dışa aktarıyoruz.
export const postForm = (initialPostData = {}) => { // <-- Burada `export const` eklendi
    return {
        // ... mevcut tüm Alpine.js mantığı buraya devam edecek ...
        formData: {
            id: initialPostData.id || null,
            title: initialPostData.title || '',
            content: initialPostData.content || '',
            is_published: !!initialPostData.is_published,
            published_at: initialPostData.published_at || '',
        },
        isEdit: false,
        isLoading: false,

        init() {
            console.log('postForm init called with initialPostData:', initialPostData);
            console.log('postForm init: formData after initialisation:', this.formData);
            this.isEdit = this.formData.id ? true : false;
        },

        async submitForm() {
            // ... submitForm mantığı ...
            this.isLoading = true;
            console.log('Form gönderiliyor. formData:', this.formData);

            let url = '';
            let method = '';

            const payload = {
                ...this.formData,
                is_published: this.formData.is_published ? 1 : 0,
                published_at: this.formData.published_at || null,
            };

            if (this.isEdit) {
                url = `/posts/${this.formData.id}`;
                method = 'PUT';
            } else {
                url = '/posts';
                method = 'POST';
            }

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    },
                    body: JSON.stringify(payload),
                });

                const data = await response.json();
                console.log('Server response:', data);

                if (response.ok) {
                    Swal.fire('Başarılı!', data.message || 'İşlem başarıyla tamamlandı!', 'success');
                    this.$dispatch('close-modal');
                    window.dispatchEvent(new CustomEvent('datatable-reload'));
                } else {
                    const errorMessage = data.message || 'Bir hata oluştu.';
                    Swal.fire('Hata!', errorMessage, 'error');
                }
            } catch (error) {
                console.error('Form gönderilirken hata oluştu:', error);
                Swal.fire('Hata!', 'Bir ağ hatası oluştu veya sunucuya ulaşılamadı: ' + error.message, 'error');
            } finally {
                this.isLoading = false;
            }
        },
    };
};

// Ve sonra bu fonksiyonu Alpine.data'ya kaydedin
Alpine.data('postForm', postForm);
