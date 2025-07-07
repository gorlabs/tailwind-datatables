// gorlabs-datatable/resources/js/app.js


import JSZip from 'jszip';
window.JSZip = JSZip;

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from 'pdfmake/build/vfs_fonts';
window.pdfMake = pdfMake;
window.pdfMake.vfs = pdfFonts.vfs;

import Alpine from 'alpinejs';
window.Alpine = Alpine; // Alpine'ı global yap
import persist from '@alpinejs/persist';
Alpine.plugin(persist);

import Swal from 'sweetalert2';
window.Swal = Swal;

// **PAKETİN KENDİ KAYNAK JS DOSYALARINI IMPORT ET**
import { registerGorlabsDatatablesAlpineComponents } from './crud-datatable';

// Alpine bileşenlerini Alpine.start() çağrılmadan ÖNCE kaydedin.
registerGorlabsDatatablesAlpineComponents(window.Alpine);

// Post Form Alpine bileşenini de doğrudan paketten import et
import './post-form.js';
console.log("GorlabsDatatables Alpine components registered successfully.");

// Alpine'ı başlat
Alpine.start();

// Livewire lifecycle hook ile Alpine componentlerini yeniden başlat (isteğe bağlı ama önerilir)
document.addEventListener('livewire:load', function () {
    Livewire.hook('message.processed', (message, component) => {
        if (window.Alpine) {
            window.Alpine.discoverUninitializedComponents((el) => {
                window.Alpine.initializeComponent(el);
            });
            console.log("Livewire message.processed: Alpine components re-initialized.");
        }
    });
});


