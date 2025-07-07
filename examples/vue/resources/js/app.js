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
