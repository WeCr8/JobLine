interface Prop {
    name: string;
    type: string;
    default: string;
    description: string;
}
interface Props {
    title: string;
    code?: string;
    props?: Prop[];
    states?: {
        id: string;
        name: string;
        data?: any;
    }[];
    initialState?: string;
    loading?: boolean;
    error?: boolean;
    errorMessage?: string;
}
declare const _default: __VLS_WithSlots<import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    retry: () => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onRetry?: (() => any) | undefined;
}>, {
    loading: boolean;
    error: boolean;
    code: string;
    props: Prop[];
    states: {
        id: string;
        name: string;
        data?: any;
    }[];
    initialState: string;
    errorMessage: string;
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
