"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var chart_js_1 = require("chart.js");
var vue_chartjs_1 = require("vue-chartjs");
var outline_1 = require("@heroicons/vue/24/outline");
chart_js_1.Chart.register(chart_js_1.CategoryScale, chart_js_1.LinearScale, chart_js_1.BarElement, chart_js_1.LineElement, chart_js_1.PointElement, chart_js_1.ArcElement, chart_js_1.Title, chart_js_1.Tooltip, chart_js_1.Legend, chart_js_1.Filler);
var props = withDefaults(defineProps(), {
    defaultType: 'bar'
});
var emit = defineEmits();
var selectedChartType = (0, vue_1.ref)(props.defaultType);
var chartData = (0, vue_1.computed)(function () { return ({
    labels: props.data.labels,
    datasets: props.data.datasets.map(function (dataset) { return (__assign(__assign({}, dataset), { backgroundColor: selectedChartType.value === 'bar' || selectedChartType.value === 'line'
            ? dataset.backgroundColor || '#3b82f6'
            : generateColors(props.data.labels.length), borderColor: selectedChartType.value === 'line'
            ? dataset.borderColor || '#2563eb'
            : undefined, borderWidth: selectedChartType.value === 'line' ? 2 : 1, fill: selectedChartType.value === 'line' ? false : undefined, tension: selectedChartType.value === 'line' ? 0.4 : undefined })); })
}); });
var chartOptions = (0, vue_1.computed)(function () { return ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: selectedChartType.value !== 'bar',
            position: 'bottom'
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#374151',
            borderWidth: 1
        }
    },
    scales: selectedChartType.value === 'bar' || selectedChartType.value === 'line' ? {
        x: {
            grid: {
                display: false
            }
        },
        y: {
            beginAtZero: true,
            grid: {
                color: '#f3f4f6'
            }
        }
    } : undefined
}); });
var doughnutOptions = (0, vue_1.computed)(function () { return ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom'
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff'
        }
    }
}); });
var generateColors = function (count) {
    var colors = [
        '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
        '#8b5cf6', '#06b6d4', '#84cc16', '#f97316',
        '#ec4899', '#6366f1'
    ];
    return Array.from({ length: count }, function (_, i) { return colors[i % colors.length]; });
};
var updateChartType = function () {
    emit('chart-type-changed', selectedChartType.value);
};
var refreshData = function () {
    emit('refresh');
};
(0, vue_1.watch)(function () { return props.defaultType; }, function (newType) {
    selectedChartType.value = newType;
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
var __VLS_withDefaultsArg = (function (t) { return t; })({
    defaultType: 'bar'
});
var __VLS_ctx = {};
var __VLS_components;
var __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "bg-white rounded-lg shadow-sm border border-gray-200" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "p-4 border-b border-gray-200" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center justify-between" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)(__assign({ class: "text-lg font-semibold text-gray-900" }));
(__VLS_ctx.title);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "flex items-center space-x-2" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)(__assign(__assign({ onChange: (__VLS_ctx.updateChartType) }, { value: (__VLS_ctx.selectedChartType) }), { class: "text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-primary-500 focus:border-primary-500" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "bar",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "line",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "doughnut",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "pie",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)(__assign({ onClick: (__VLS_ctx.refreshData) }, { class: "p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200" }));
var __VLS_0 = {}.ArrowPathIcon;
/** @type {[typeof __VLS_components.ArrowPathIcon, ]} */ ;
// @ts-ignore
var __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0(__assign({ class: "w-4 h-4" })));
var __VLS_2 = __VLS_1.apply(void 0, __spreadArray([__assign({ class: "w-4 h-4" })], __VLS_functionalComponentArgsRest(__VLS_1), false));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "p-6" }));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)(__assign({ class: "relative" }, { style: {} }));
if (__VLS_ctx.selectedChartType === 'bar') {
    var __VLS_4 = {}.Bar;
    /** @type {[typeof __VLS_components.Bar, ]} */ ;
    // @ts-ignore
    var __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        data: (__VLS_ctx.chartData),
        options: (__VLS_ctx.chartOptions),
    }));
    var __VLS_6 = __VLS_5.apply(void 0, __spreadArray([{
            data: (__VLS_ctx.chartData),
            options: (__VLS_ctx.chartOptions),
        }], __VLS_functionalComponentArgsRest(__VLS_5), false));
}
else if (__VLS_ctx.selectedChartType === 'line') {
    var __VLS_8 = {}.Line;
    /** @type {[typeof __VLS_components.Line, ]} */ ;
    // @ts-ignore
    var __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        data: (__VLS_ctx.chartData),
        options: (__VLS_ctx.chartOptions),
    }));
    var __VLS_10 = __VLS_9.apply(void 0, __spreadArray([{
            data: (__VLS_ctx.chartData),
            options: (__VLS_ctx.chartOptions),
        }], __VLS_functionalComponentArgsRest(__VLS_9), false));
}
else if (__VLS_ctx.selectedChartType === 'doughnut') {
    var __VLS_12 = {}.Doughnut;
    /** @type {[typeof __VLS_components.Doughnut, ]} */ ;
    // @ts-ignore
    var __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        data: (__VLS_ctx.chartData),
        options: (__VLS_ctx.doughnutOptions),
    }));
    var __VLS_14 = __VLS_13.apply(void 0, __spreadArray([{
            data: (__VLS_ctx.chartData),
            options: (__VLS_ctx.doughnutOptions),
        }], __VLS_functionalComponentArgsRest(__VLS_13), false));
}
else if (__VLS_ctx.selectedChartType === 'pie') {
    var __VLS_16 = {}.Pie;
    /** @type {[typeof __VLS_components.Pie, ]} */ ;
    // @ts-ignore
    var __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
        data: (__VLS_ctx.chartData),
        options: (__VLS_ctx.doughnutOptions),
    }));
    var __VLS_18 = __VLS_17.apply(void 0, __spreadArray([{
            data: (__VLS_ctx.chartData),
            options: (__VLS_ctx.doughnutOptions),
        }], __VLS_functionalComponentArgsRest(__VLS_17), false));
}
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['p-4']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-200']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-900']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['space-x-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-gray-300']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-md']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:border-primary-500']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-gray-400']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-gray-600']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
var __VLS_dollars;
var __VLS_self = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {
            Bar: vue_chartjs_1.Bar,
            Line: vue_chartjs_1.Line,
            Doughnut: vue_chartjs_1.Doughnut,
            Pie: vue_chartjs_1.Pie,
            ArrowPathIcon: outline_1.ArrowPathIcon,
            selectedChartType: selectedChartType,
            chartData: chartData,
            chartOptions: chartOptions,
            doughnutOptions: doughnutOptions,
            updateChartType: updateChartType,
            refreshData: refreshData,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
exports.default = (await Promise.resolve().then(function () { return require('vue'); })).defineComponent({
    setup: function () {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
