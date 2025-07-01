interface NotificationEvent {
    id: string;
    name: string;
    description: string;
    email: boolean;
    push: boolean;
    sms: boolean;
}
type __VLS_Props = {
    event: NotificationEvent;
    emailEnabled: boolean;
    pushEnabled: boolean;
    smsEnabled: boolean;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
