import type { Ref } from 'vue';
export declare function useElementSize(elementRef: Ref<HTMLElement | null>): {
    width: Ref<number, number>;
    height: Ref<number, number>;
};
