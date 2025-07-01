import type { ConnectionConfig } from '../types/integration';
interface Props {
    connection: ConnectionConfig;
    disabled?: boolean;
    testing?: boolean;
    importing?: boolean;
}
declare const _default: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "test-connection": (connectionId: string) => any;
    "run-import": (connectionId: string) => any;
    "edit-connection": (connectionId: string) => any;
    "delete-connection": (connectionId: string) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onTest-connection"?: ((connectionId: string) => any) | undefined;
    "onRun-import"?: ((connectionId: string) => any) | undefined;
    "onEdit-connection"?: ((connectionId: string) => any) | undefined;
    "onDelete-connection"?: ((connectionId: string) => any) | undefined;
}>, {
    testing: boolean;
    disabled: boolean;
    importing: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
