<form x-data="postForm($store.modalData.form)"
      @submit.prevent="submitForm"
      class="space-y-4 p-4">

    {{-- Başlık Girişi --}}
    <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Başlık</label>
        <input type="text" x-model="formData.title" id="title" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required>
    </div>

    {{-- İçerik Metin Alanı --}}
    <div>
        <label for="content" class="block text-sm font-medium text-gray-700">İçerik</label>
        <textarea x-model="formData.content" id="content" rows="4" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
    </div>

    {{-- Yayınlanma Durumu Checkbox --}}
    <div class="flex items-center">
        <input type="checkbox" x-model="formData.is_published" id="is_published" class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
        <label for="is_published" class="ml-2 block text-sm text-gray-900">Yayınlandı mı?</label>
    </div>

    {{-- Yayınlanma Tarihi Girişi (datetime-local) --}}
    <div>
        <label for="published_at" class="block text-sm font-medium text-gray-700">Yayınlanma Tarihi (İsteğe Bağlı)</label>
        <input type="datetime-local" x-model="formData.published_at" id="published_at" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
    </div>

    {{-- Form Butonları --}}
    <div class="flex justify-end space-x-3">
        <button type="button" @click="$dispatch('close-modal')" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            İptal
        </button>
        <button type="submit" x-bind:disabled="isLoading"  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span x-show="!isLoading">Kaydet</span>
            <span x-show="isLoading">Kaydediliyor...</span>
        </button>
    </div>
</form>
