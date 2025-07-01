import type { ImportMapping } from '../types/integration';
interface Props {
    modelValue: ImportMapping[];
    sourceFields?: string[];
    targetFields?: string[];
    sampleData?: any[];
    title?: string;
    description?: string;
    showCompliance?: boolean;
    showAutoMap?: boolean;
    showSampleData?: boolean;
    disabled?: boolean;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: ImportMapping[]) => any;
    "update:modelValue": (value: ImportMapping[]) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onChange?: ((value: ImportMapping[]) => any) | undefined;
    "onUpdate:modelValue"?: ((value: ImportMapping[]) => any) | undefined;
}>, {
    title: string;
    disabled: boolean;
    description: string;
    sourceFields: string[];
    targetFields: string[];
    sampleData: any[];
    showCompliance: boolean;
    showAutoMap: boolean;
    showSampleData: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
