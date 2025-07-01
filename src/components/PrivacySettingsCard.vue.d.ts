type __VLS_Props = {
    analyticsEnabled: boolean;
    errorReportingEnabled: boolean;
    marketingEnabled: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:analyticsEnabled": (value: boolean) => any;
    "update:errorReportingEnabled": (value: boolean) => any;
    "update:marketingEnabled": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:analyticsEnabled"?: ((value: boolean) => any) | undefined;
    "onUpdate:errorReportingEnabled"?: ((value: boolean) => any) | undefined;
    "onUpdate:marketingEnabled"?: ((value: boolean) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
