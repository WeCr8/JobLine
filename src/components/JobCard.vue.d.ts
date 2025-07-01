import type { Job } from '../types';
interface Props {
    job: Job;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update-status": (jobId: string) => any;
    "view-details": (jobId: string) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onUpdate-status"?: ((jobId: string) => any) | undefined;
    "onView-details"?: ((jobId: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
