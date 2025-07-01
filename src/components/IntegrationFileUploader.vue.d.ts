import type { ImportType } from '../types/integration';
interface Props {
    acceptedFormats?: string[];
    maxFileSize?: number;
    description?: string;
    disabled?: boolean;
    defaultConnectionId?: string;
    defaultImportType?: ImportType;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "upload-start": (file: File) => any;
    "upload-progress": (progress: number) => any;
    "upload-complete": (result: any) => any;
    "upload-error": (error: string) => any;
    "upload-cancel": () => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onUpload-start"?: ((file: File) => any) | undefined;
    "onUpload-progress"?: ((progress: number) => any) | undefined;
    "onUpload-complete"?: ((result: any) => any) | undefined;
    "onUpload-error"?: ((error: string) => any) | undefined;
    "onUpload-cancel"?: (() => any) | undefined;
}>, {
    description: string;
    disabled: boolean;
    acceptedFormats: string[];
    maxFileSize: number;
    defaultConnectionId: string;
    defaultImportType: ImportType;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
