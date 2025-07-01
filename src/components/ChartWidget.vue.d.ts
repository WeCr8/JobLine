import type { ChartType, ChartData } from '../types';
interface Props {
    title: string;
    data: ChartData;
    defaultType?: ChartType;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "chart-type-changed": (type: ChartType) => any;
    refresh: () => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onChart-type-changed"?: ((type: ChartType) => any) | undefined;
    onRefresh?: (() => any) | undefined;
}>, {
    defaultType: ChartType;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
