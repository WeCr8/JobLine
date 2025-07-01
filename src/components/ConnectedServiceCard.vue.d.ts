interface ConnectedService {
    id: string;
    name: string;
    status: 'connected' | 'disconnected';
    icon: any;
    bgColor: string;
}
type __VLS_Props = {
    service: ConnectedService;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    toggle: (service: ConnectedService) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onToggle?: ((service: ConnectedService) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
