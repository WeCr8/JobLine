interface Props {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning' | 'info';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    as?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    loading?: boolean;
    loadingText?: string;
    fullWidth?: boolean;
    rounded?: boolean;
    iconLeft?: any;
    iconRight?: any;
    ripple?: boolean;
    label?: string;
}
declare const _default: __VLS_WithSlots<import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: (event: MouseEvent) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onClick?: ((event: MouseEvent) => any) | undefined;
}>, {
    loading: boolean;
    type: "reset" | "submit" | "button";
    disabled: boolean;
    size: "xs" | "sm" | "md" | "lg" | "xl";
    variant: "warning" | "success" | "primary" | "secondary" | "ghost" | "danger" | "info";
    as: string;
    loadingText: string;
    fullWidth: boolean;
    rounded: boolean;
    ripple: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, {
    default?: ((props: {}) => any) | undefined;
}>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
