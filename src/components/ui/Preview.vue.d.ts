interface State {
    id: string;
    name: string;
    data?: any;
}
interface Device {
    id: string;
    name: string;
    width: number;
    height: number;
    icon: any;
}
interface Props {
    title?: string;
    states?: State[];
    initialState?: string;
    loading?: boolean;
    error?: boolean;
    errorMessage?: string;
    retryEnabled?: boolean;
    devices?: Device[];
    initialDevice?: string;
}
declare const _default: __VLS_WithSlots<import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:state": (stateId: string) => any;
    "update:device": (deviceId: string) => any;
    retry: () => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onUpdate:state"?: ((stateId: string) => any) | undefined;
    "onUpdate:device"?: ((deviceId: string) => any) | undefined;
    onRetry?: (() => any) | undefined;
}>, {
    loading: boolean;
    error: boolean;
    title: string;
    states: State[];
    initialState: string;
    errorMessage: string;
    retryEnabled: boolean;
    devices: Device[];
    initialDevice: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, {
    default?: ((props: {
        state: any;
    }) => any) | undefined;
}>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
