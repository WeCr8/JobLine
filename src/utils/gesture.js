"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLongPressGesture = exports.addPanGesture = exports.addTapGesture = exports.addPinchGesture = exports.addSwipeGesture = void 0;
var hammerjs_1 = require("hammerjs");
/**
 * Gesture utilities for cross-platform touch interactions
 */
// Add swipe gesture to an element
var addSwipeGesture = function (element, onSwipe) {
    var hammer = new hammerjs_1.default(element);
    hammer.get('swipe').set({ direction: hammerjs_1.default.DIRECTION_ALL });
    var handleSwipe = function (event) {
        switch (event.direction) {
            case hammerjs_1.default.DIRECTION_LEFT:
                onSwipe('left');
                break;
            case hammerjs_1.default.DIRECTION_RIGHT:
                onSwipe('right');
                break;
            case hammerjs_1.default.DIRECTION_UP:
                onSwipe('up');
                break;
            case hammerjs_1.default.DIRECTION_DOWN:
                onSwipe('down');
                break;
        }
    };
    hammer.on('swipe', handleSwipe);
    // Return cleanup function
    return function () {
        hammer.off('swipe', handleSwipe);
        hammer.destroy();
    };
};
exports.addSwipeGesture = addSwipeGesture;
// Add pinch zoom gesture to an element
var addPinchGesture = function (element, onPinch) {
    var hammer = new hammerjs_1.default(element);
    hammer.get('pinch').set({ enable: true });
    var handlePinch = function (event) {
        onPinch(event.scale, event);
    };
    hammer.on('pinch', handlePinch);
    // Return cleanup function
    return function () {
        hammer.off('pinch', handlePinch);
        hammer.destroy();
    };
};
exports.addPinchGesture = addPinchGesture;
// Add tap gesture to an element
var addTapGesture = function (element, onTap, options) {
    if (options === void 0) { options = {}; }
    var hammer = new hammerjs_1.default(element);
    if (options.doubleTap) {
        hammer.get('tap').set({ taps: 2 });
    }
    hammer.on('tap', onTap);
    // Return cleanup function
    return function () {
        hammer.off('tap', onTap);
        hammer.destroy();
    };
};
exports.addTapGesture = addTapGesture;
// Add pan gesture to an element
var addPanGesture = function (element, onPan, onPanEnd) {
    var hammer = new hammerjs_1.default(element);
    hammer.get('pan').set({ direction: hammerjs_1.default.DIRECTION_ALL });
    hammer.on('pan', onPan);
    if (onPanEnd) {
        hammer.on('panend', onPanEnd);
    }
    // Return cleanup function
    return function () {
        hammer.off('pan', onPan);
        if (onPanEnd) {
            hammer.off('panend', onPanEnd);
        }
        hammer.destroy();
    };
};
exports.addPanGesture = addPanGesture;
// Add long press gesture to an element
var addLongPressGesture = function (element, onLongPress) {
    var hammer = new hammerjs_1.default(element);
    hammer.get('press').set({ time: 500 }); // 500ms for long press
    hammer.on('press', onLongPress);
    // Return cleanup function
    return function () {
        hammer.off('press', onLongPress);
        hammer.destroy();
    };
};
exports.addLongPressGesture = addLongPressGesture;
