import { AppPageProps } from '@/types/index';
import type Swal from 'sweetalert2'; // type import kullan
import type dayjs from 'dayjs';     // type import kullan
import type Alpine from 'alpinejs';  // type import kullan
import type * as pdfMake from 'pdfmake/build/pdfmake'; // type import kullan
import type * as JSZip from 'jszip'; // type import kullan

// Extend ImportMeta interface for Vite...
declare module 'vite/client' {
    interface ImportMetaEnv {
        readonly VITE_APP_NAME: string;
        [key: string]: string | boolean | undefined;
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
        readonly glob: <T>(pattern: string) => Record<string, () => Promise<T>>;
    }
}

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps, AppPageProps {}
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $inertia: typeof Router;
        $page: Page;
        $headManager: ReturnType<typeof createHeadManager>;
    }
}

declare global {
    interface Window {
        GorlabsDatatables: {
            date: (format: string) => (data: any, type: string, row: any) => string;
            statusBadge: (publishedText: string, draftText: string) => (data: any, type: string, row: any) => string;
            actions: (updateUrlPrefix: string, deleteUrlPrefix: string) => (data: any, type: string, row: any) => string;
            // Diğer GorlabsDatatables metotlarını da buraya ekleyin
        };
        Swal: any; // SweetAlert2 için de benzer şekilde ekleyebilirsiniz
        openFormModal: (title: string, url: string, item: any | null) => void; // Global fonksiyon için de
    }
}

// ********************************************************************
// * Yeni Eklenecek Kısım: Global Window Objektif Tanımları             *
// ********************************************************************
declare global {
    interface Window {
        Swal: typeof Swal;
        dayjs: typeof dayjs;
        Alpine: typeof Alpine;
        pdfMake: typeof pdfMake;
        JSZip: typeof JSZip;
        jQuery: JQuery;
        $: JQuery;
        crudDataTable: (config: any) => any;
    }
}
