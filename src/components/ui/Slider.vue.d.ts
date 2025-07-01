interface Props {
    modelValue: number | number[];
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    vertical?: boolean;
    range?: boolean;
    showValue?: boolean;
    showTicks?: boolean;
    ticks?: {
        value: number;
        label?: string;
    }[];
    id?: string;
    label?: string;
    ariaLabel?: string;
    ariaLabelledby?: string;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    change: (value: number | number[]) => any;
    "update:modelValue": (value: number | number[]) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onChange?: ((value: number | number[]) => any) | undefined;
    "onUpdate:modelValue"?: ((value: number | number[]) => any) | undefined;
}>, {
    id: string;
    range: boolean;
    disabled: boolean;
    min: number;
    max: number;
    ticks: {
        value: number;
        label?: string | undefined;
    }[];
    step: number;
    vertical: boolean;
    showValue: boolean;
    showTicks: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
