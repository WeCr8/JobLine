type __VLS_Props = {
    twoFactorEnabled: boolean;
    sessionTimeout: string;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:twoFactorEnabled": (value: boolean) => any;
    "update:sessionTimeout": (value: string) => any;
    verify: (code: string) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:twoFactorEnabled"?: ((value: boolean) => any) | undefined;
    "onUpdate:sessionTimeout"?: ((value: string) => any) | undefined;
    onVerify?: ((code: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
