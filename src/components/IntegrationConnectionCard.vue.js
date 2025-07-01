import { ref } from 'vue';
import { format } from 'date-fns';
import { CloudIcon, DocumentArrowUpIcon, GlobeAltIcon, CircleStackIcon, BuildingOfficeIcon, BoltIcon, ServerIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
const props = withDefaults(defineProps(), {
    disabled: false,
    testing: false,
    importing: false
});
const emit = defineEmits();
// State
const showDeleteConfirm = ref(false);
// Methods
const getConnectionIcon = (type) => {
    const icons = {
        'google-sheets': CloudIcon,
        'csv-upload': DocumentArrowUpIcon,
        'rest-api': GlobeAltIcon,
        'sql-odbc': CircleStackIcon,
        'sap-bapi': BuildingOfficeIcon,
        'webhook': BoltIcon,
        'sftp': ServerIcon
    };
    return icons[type] || GlobeAltIcon;
};
const getConnectionTypeColor = (type) => {
    const colors = {
        'google-sheets': 'bg-green-100 text-green-600',
        'csv-upload': 'bg-blue-100 text-blue-600',
        'rest-api': 'bg-purple-100 text-purple-600',
        'sql-odbc': 'bg-orange-100 text-orange-600',
        'sap-bapi': 'bg-indigo-100 text-indigo-600',
        'webhook': 'bg-yellow-100 text-yellow-600',
        'sftp': 'bg-gray-100 text-gray-600'
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
};
const getConnectionTypeLabel = (type) => {
    const labels = {
        'google-sheets': 'Google Sheets API',
        'csv-upload': 'CSV File Upload',
        'rest-api': 'REST API',
        'sql-odbc': 'SQL/ODBC Connection',
        'sap-bapi': 'SAP BAPI Connector',
        'webhook': 'Webhook Listener',
        'sftp': 'SFTP File Drop'
    };
    return labels[type] || type;
};
const getStatusClass = (status) => {
    const classes = {
        'active': 'bg-green-100 text-green-800',
        'inactive': 'bg-gray-100 text-gray-800',
        'error': 'bg-red-100 text-red-800',
        'testing': 'bg-yellow-100 text-yellow-800'
    };
    return classes[status] || classes.inactive;
};
const getComplianceClass = (level) => {
    const classes = {
        'basic': 'bg-gray-100 text-gray-800',
        'itar': 'bg-red-100 text-red-800',
        'ear': 'bg-orange-100 text-orange-800',
        'cmmc-2': 'bg-blue-100 text-blue-800',
        'cmmc-3': 'bg-purple-100 text-purple-800'
    };
    return classes[level] || classes.basic;
};
const getStatusDot = (status) => {
    const classes = {
        'active': 'bg-green-500 animate-pulse',
        'inactive': 'bg-gray-400',
        'error': 'bg-red-500',
        'testing': 'bg-yellow-500 animate-pulse'
    };
    return classes[status] || classes.inactive;
};
const getStatusText = (status) => {
    const texts = {
        'active': 'Connected and syncing',
        'inactive': 'Connection disabled',
        'error': 'Connection failed',
        'testing': 'Testing connection'
    };
    return texts[status] || 'Unknown status';
};
const formatTime = (timestamp) => {
    return format(new Date(timestamp), 'MMM dd, HH:mm');
};
const formatInterval = (minutes) => {
    if (minutes < 60) {
        return `${minutes} minutes`;
    }
    else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0
            ? `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} min`
            : `${hours} hour${hours > 1 ? 's' : ''}`;
    }
};
const confirmDelete = () => {
    showDeleteConfirm.value = true;
};
const deleteConnection = () => {
    showDeleteConfirm.value = false;
    emit('delete-connection', props.connection.id);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    disabled: false,
    testing: false,
    importing: false
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['connection-card']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-action-test']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-action-import']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-action-edit']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-action-delete']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-action-button']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-modal-button-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-modal-button-delete']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-action-test']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-action-import']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-action-edit']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-action-delete']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-action-button']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-action-button']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "connection-card" },
    ...{ class: ({ 'connection-card-disabled': __VLS_ctx.disabled }) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "connection-card-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "connection-card-icon-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "connection-card-icon" },
    ...{ class: (__VLS_ctx.getConnectionTypeColor(__VLS_ctx.connection.type)) },
});
const __VLS_0 = ((__VLS_ctx.getConnectionIcon(__VLS_ctx.connection.type)));
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "w-5 h-5" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "w-5 h-5" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "connection-card-title-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({
    ...{ class: "connection-card-title" },
});
(__VLS_ctx.connection.name);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "connection-card-subtitle" },
});
(__VLS_ctx.getConnectionTypeLabel(__VLS_ctx.connection.type));
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "connection-card-badges" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "connection-card-badge" },
    ...{ class: (__VLS_ctx.getStatusClass(__VLS_ctx.connection.status)) },
});
(__VLS_ctx.connection.status.toUpperCase());
if (__VLS_ctx.connection.complianceLevel) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "connection-card-badge" },
        ...{ class: (__VLS_ctx.getComplianceClass(__VLS_ctx.connection.complianceLevel)) },
    });
    (__VLS_ctx.connection.complianceLevel.toUpperCase());
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "connection-card-status" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "connection-card-status-indicator" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "connection-card-status-dot" },
    ...{ class: (__VLS_ctx.getStatusDot(__VLS_ctx.connection.status)) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "connection-card-status-text" },
});
(__VLS_ctx.getStatusText(__VLS_ctx.connection.status));
if (__VLS_ctx.connection.lastSync) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "connection-card-last-sync" },
    });
    (__VLS_ctx.formatTime(__VLS_ctx.connection.lastSync));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "connection-card-details" },
});
if (__VLS_ctx.connection.config.pollIntervalMinutes) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "connection-card-detail" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "connection-card-detail-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "connection-card-detail-value" },
    });
    (__VLS_ctx.formatInterval(__VLS_ctx.connection.config.pollIntervalMinutes));
}
if (__VLS_ctx.connection.errorCount > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "connection-card-detail" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "connection-card-detail-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "connection-card-detail-value connection-card-detail-error" },
    });
    (__VLS_ctx.connection.errorCount);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "connection-card-config" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
    ...{ class: "connection-card-config-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "connection-card-config-details" },
});
if (__VLS_ctx.connection.config.baseUrl) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "connection-card-config-detail" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "connection-card-config-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "connection-card-config-value" },
    });
    (__VLS_ctx.connection.config.baseUrl);
}
if (__VLS_ctx.connection.config.spreadsheetId) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "connection-card-config-detail" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "connection-card-config-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "connection-card-config-value" },
    });
    (__VLS_ctx.connection.config.sheetName || __VLS_ctx.connection.config.spreadsheetId);
}
if (__VLS_ctx.connection.config.sapHost) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "connection-card-config-detail" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "connection-card-config-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "connection-card-config-value" },
    });
    (__VLS_ctx.connection.config.sapHost);
}
if (__VLS_ctx.connection.config.host) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "connection-card-config-detail" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "connection-card-config-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "connection-card-config-value" },
    });
    (__VLS_ctx.connection.config.host);
}
if (__VLS_ctx.connection.config.databaseName) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "connection-card-config-detail" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "connection-card-config-label" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "connection-card-config-value" },
    });
    (__VLS_ctx.connection.config.databaseName);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "connection-card-actions" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('test-connection', __VLS_ctx.connection.id);
        } },
    type: "button",
    ...{ class: "connection-card-action-button connection-card-action-test" },
    disabled: (__VLS_ctx.disabled || __VLS_ctx.testing),
});
if (__VLS_ctx.testing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "connection-card-action-loading" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: "animate-spin h-4 w-4" },
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle, __VLS_intrinsicElements.circle)({
        ...{ class: "opacity-25" },
        cx: "12",
        cy: "12",
        r: "10",
        stroke: "currentColor",
        'stroke-width': "4",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        ...{ class: "opacity-75" },
        fill: "currentColor",
        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('run-import', __VLS_ctx.connection.id);
        } },
    type: "button",
    ...{ class: "connection-card-action-button connection-card-action-import" },
    disabled: (__VLS_ctx.disabled || __VLS_ctx.connection.status !== 'active' || __VLS_ctx.importing),
});
if (__VLS_ctx.importing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "connection-card-action-loading" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        ...{ class: "animate-spin h-4 w-4" },
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle, __VLS_intrinsicElements.circle)({
        ...{ class: "opacity-25" },
        cx: "12",
        cy: "12",
        r: "10",
        stroke: "currentColor",
        'stroke-width': "4",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        ...{ class: "opacity-75" },
        fill: "currentColor",
        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z",
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.$emit('edit-connection', __VLS_ctx.connection.id);
        } },
    type: "button",
    ...{ class: "connection-card-action-button connection-card-action-edit" },
    disabled: (__VLS_ctx.disabled),
    'aria-label': "Edit connection",
});
const __VLS_4 = {}.PencilIcon;
/** @type {[typeof __VLS_components.PencilIcon, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ class: "w-4 h-4" },
}));
const __VLS_6 = __VLS_5({
    ...{ class: "w-4 h-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.confirmDelete) },
    type: "button",
    ...{ class: "connection-card-action-button connection-card-action-delete" },
    disabled: (__VLS_ctx.disabled),
    'aria-label': "Delete connection",
});
const __VLS_8 = {}.TrashIcon;
/** @type {[typeof __VLS_components.TrashIcon, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ class: "w-4 h-4" },
}));
const __VLS_10 = __VLS_9({
    ...{ class: "w-4 h-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
if (__VLS_ctx.showDeleteConfirm) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "connection-card-modal-backdrop" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "connection-card-modal" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({
        ...{ class: "connection-card-modal-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "connection-card-modal-message" },
    });
    (__VLS_ctx.connection.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "connection-card-modal-actions" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.showDeleteConfirm))
                    return;
                __VLS_ctx.showDeleteConfirm = false;
            } },
        type: "button",
        ...{ class: "connection-card-modal-button connection-card-modal-button-cancel" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.deleteConnection) },
        type: "button",
        ...{ class: "connection-card-modal-button connection-card-modal-button-delete" },
    });
}
/** @type {__VLS_StyleScopedClasses['connection-card']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-disabled']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-icon-container']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['w-5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-title-container']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-title']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-badges']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-status']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-status-indicator']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-status-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-status-text']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-last-sync']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-details']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-detail-label']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-detail-value']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-detail-label']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-detail-value']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-detail-error']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-config']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-config-title']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-config-details']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-config-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-config-label']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-config-value']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-config-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-config-label']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-config-value']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-config-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-config-label']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-config-value']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-config-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-config-label']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-config-value']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-config-detail']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-config-label']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-config-value']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-action-button']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-action-test']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-action-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-action-button']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-action-import']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-action-loading']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-spin']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-25']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-action-button']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-action-edit']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-action-button']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-action-delete']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-modal-backdrop']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-modal']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-modal-title']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-modal-message']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-modal-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-modal-button']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-modal-button-cancel']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-modal-button']} */ ;
/** @type {__VLS_StyleScopedClasses['connection-card-modal-button-delete']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            PencilIcon: PencilIcon,
            TrashIcon: TrashIcon,
            showDeleteConfirm: showDeleteConfirm,
            getConnectionIcon: getConnectionIcon,
            getConnectionTypeColor: getConnectionTypeColor,
            getConnectionTypeLabel: getConnectionTypeLabel,
            getStatusClass: getStatusClass,
            getComplianceClass: getComplianceClass,
            getStatusDot: getStatusDot,
            getStatusText: getStatusText,
            formatTime: formatTime,
            formatInterval: formatInterval,
            confirmDelete: confirmDelete,
            deleteConnection: deleteConnection,
        };
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
