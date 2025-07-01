"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useElementSize = useElementSize;
/**
 * Composable for tracking element size changes
 */
var vue_1 = require("vue");
function useElementSize(elementRef) {
    var width = (0, vue_1.ref)(0);
    var height = (0, vue_1.ref)(0);
    var resizeObserver = null;
    var updateSize = function () {
        if (elementRef.value) {
            var rect = elementRef.value.getBoundingClientRect();
            width.value = rect.width;
            height.value = rect.height;
        }
    };
    (0, vue_1.onMounted)(function () {
        updateSize();
        if (window.ResizeObserver) {
            resizeObserver = new ResizeObserver(updateSize);
            if (elementRef.value) {
                resizeObserver.observe(elementRef.value);
            }
        }
        else {
            // Fallback for browsers without ResizeObserver
            window.addEventListener('resize', updateSize);
        }
        // Watch for element reference changes
        var unwatch = (0, vue_2.watch)(elementRef, function (newEl, oldEl) {
            if (resizeObserver) {
                if (oldEl) {
                    resizeObserver.unobserve(oldEl);
                }
                if (newEl) {
                    resizeObserver.observe(newEl);
                    updateSize();
                }
            }
        });
    });
    (0, vue_1.onUnmounted)(function () {
        if (resizeObserver) {
            if (elementRef.value) {
                resizeObserver.unobserve(elementRef.value);
            }
            resizeObserver.disconnect();
        }
        else {
            window.removeEventListener('resize', updateSize);
        }
    });
    return { width: width, height: height };
}
var vue_2 = require("vue");
