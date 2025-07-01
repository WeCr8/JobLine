import type { Job } from '../types';
interface Props {
    title?: string;
    description?: string;
    jobs?: Job[];
    machines?: any[];
    operators?: any[];
    departments?: any[];
    loading?: boolean;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "schedule-jobs": (jobIds: string[]) => any;
    "auto-schedule": () => any;
    "optimization-complete": (results: any[]) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onSchedule-jobs"?: ((jobIds: string[]) => any) | undefined;
    "onAuto-schedule"?: (() => any) | undefined;
    "onOptimization-complete"?: ((results: any[]) => any) | undefined;
}>, {
    loading: boolean;
    description: string;
    title: string;
    jobs: Job[];
    machines: any[];
    departments: any[];
    operators: any[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
