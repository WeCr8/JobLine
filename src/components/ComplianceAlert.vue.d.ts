import type { ComplianceCheck } from '../types/integration';
interface Props {
    alerts: ComplianceCheck[];
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "view-all-alerts": () => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onView-all-alerts"?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
