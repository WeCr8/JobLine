import type { ConnectionConfig } from '../types/integration';
interface Props {
    connection: ConnectionConfig;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "test-connection": (connectionId: string) => any;
    "run-import": (connectionId: string) => any;
    "edit-connection": (connectionId: string) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onTest-connection"?: ((connectionId: string) => any) | undefined;
    "onRun-import"?: ((connectionId: string) => any) | undefined;
    "onEdit-connection"?: ((connectionId: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
