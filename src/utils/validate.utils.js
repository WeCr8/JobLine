// Validate Job
export function validateJob(job) {
    const errors = [];
    if (!job.id)
        errors.push('Job ID is required');
    if (!job.name)
        errors.push('Job name is required');
    if (!job.status)
        errors.push('Job status is required');
    if (!job.dueDate)
        errors.push('Job due date is required');
    if (job.startDate && job.dueDate && job.startDate > job.dueDate)
        errors.push('Job start date is after due date');
    if (job.completedDate && job.dueDate && job.completedDate > job.dueDate && job.status === 'completed')
        errors.push('Job completed late');
    return errors;
}
// Validate Part
export function validatePart(part) {
    const errors = [];
    if (!part.id)
        errors.push('Part ID is required');
    if (!part.name)
        errors.push('Part name is required');
    if (part.quantity <= 0)
        errors.push('Part quantity must be positive');
    return errors;
}
// Validate Operation
export function validateOperation(op) {
    const errors = [];
    if (!op.id)
        errors.push('Operation ID is required');
    if (!op.jobId)
        errors.push('Operation jobId is required');
    if (!op.name)
        errors.push('Operation name is required');
    if (op.sequence < 0)
        errors.push('Operation sequence must be >= 0');
    if (op.plannedStart && op.plannedEnd && op.plannedStart > op.plannedEnd)
        errors.push('Operation planned start is after planned end');
    if (op.actualStart && op.actualEnd && op.actualStart > op.actualEnd)
        errors.push('Operation actual start is after actual end');
    return errors;
}
// Validate Resource
export function validateResource(resource) {
    const errors = [];
    if (!resource.id)
        errors.push('Resource ID is required');
    if (!resource.name)
        errors.push('Resource name is required');
    if (!resource.type)
        errors.push('Resource type is required');
    return errors;
}
// Validate Capacity
export function validateCapacity(cap) {
    const errors = [];
    if (!cap.resourceId)
        errors.push('Capacity resourceId is required');
    if (!cap.date)
        errors.push('Capacity date is required');
    if (cap.availableMinutes < 0)
        errors.push('Capacity availableMinutes must be >= 0');
    if (cap.usedMinutes < 0)
        errors.push('Capacity usedMinutes must be >= 0');
    if (cap.usedMinutes > cap.availableMinutes)
        errors.push('Capacity usedMinutes exceeds availableMinutes');
    return errors;
}
// Validate Constraint
export function validateConstraint(constraint) {
    const errors = [];
    if (!constraint.id)
        errors.push('Constraint ID is required');
    if (!constraint.type)
        errors.push('Constraint type is required');
    if (constraint.startDate && constraint.endDate && constraint.startDate > constraint.endDate)
        errors.push('Constraint start date is after end date');
    return errors;
}
// Check for circular dependencies in operations (by sequence)
export function checkCircularOperations(operations) {
    // If sequence numbers are unique and strictly increasing, no circular dependency
    const seqs = operations.map(op => op.sequence);
    const uniqueSeqs = new Set(seqs);
    if (seqs.length !== uniqueSeqs.size)
        return ['Duplicate operation sequence numbers detected'];
    return [];
}
