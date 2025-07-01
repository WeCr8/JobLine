export const PRIORITIES = ['low', 'medium', 'high', 'urgent'];
export function isPriority(value) {
    return PRIORITIES.includes(value);
}
export function getPriorityLabel(priority) {
    switch (priority) {
        case 'low':
            return 'Low';
        case 'medium':
            return 'Medium';
        case 'high':
            return 'High';
        case 'urgent':
            return 'Urgent';
        default:
            return '';
    }
}
