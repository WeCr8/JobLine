// Normalize Excel/ERP row to Part
export function importPart(row) {
    return {
        id: String(row.id || row.part_id || row.PartID),
        name: String(row.name || row.part_name || row.PartName),
        description: row.description,
        partNumber: row.partNumber || row.PartNumber,
        revision: row.revision || row.Revision,
        jobId: row.jobId || row.JobID,
        quantity: Number(row.quantity || row.Qty || 1),
        unit: row.unit || row.Unit,
        location: row.location || row.Location,
        customFields: { ...row }
    };
}
// Normalize Excel/ERP row to Operation
export function importOperation(row) {
    return {
        id: String(row.id || row.operation_id || row.OperationID),
        jobId: String(row.jobId || row.JobID),
        partId: row.partId || row.PartID,
        name: String(row.name || row.operation_name || row.OperationName),
        description: row.description,
        status: (row.status || row.Status || 'not_started'),
        sequence: Number(row.sequence || row.Sequence || 0),
        resourceId: row.resourceId || row.ResourceID,
        plannedStart: row.plannedStart || row.PlannedStart,
        plannedEnd: row.plannedEnd || row.PlannedEnd,
        actualStart: row.actualStart || row.ActualStart,
        actualEnd: row.actualEnd || row.ActualEnd,
        durationMinutes: Number(row.durationMinutes || row.Duration || 0),
        customFields: { ...row }
    };
}
// Normalize Excel/ERP row to Resource
export function importResource(row) {
    return {
        id: String(row.id || row.resource_id || row.ResourceID),
        name: String(row.name || row.resource_name || row.ResourceName),
        type: (row.type || row.Type || 'machine'),
        available: Boolean(row.available ?? true),
        capacity: row.capacity,
        skills: row.skills ? String(row.skills).split(',') : [],
        customFields: { ...row }
    };
}
// Normalize Excel/ERP row to Capacity
export function importCapacity(row) {
    return {
        resourceId: String(row.resourceId || row.ResourceID),
        date: row.date || row.Date,
        availableMinutes: Number(row.availableMinutes || row.AvailableMinutes || 0),
        usedMinutes: Number(row.usedMinutes || row.UsedMinutes || 0),
        customFields: { ...row }
    };
}
// Normalize Excel/ERP row to Constraint
export function importConstraint(row) {
    return {
        id: String(row.id || row.constraint_id || row.ConstraintID),
        type: (row.type || row.Type || 'custom'),
        description: row.description,
        affectedJobIds: row.affectedJobIds ? String(row.affectedJobIds).split(',') : [],
        affectedPartIds: row.affectedPartIds ? String(row.affectedPartIds).split(',') : [],
        affectedResourceIds: row.affectedResourceIds ? String(row.affectedResourceIds).split(',') : [],
        startDate: row.startDate || row.StartDate,
        endDate: row.endDate || row.EndDate,
        customFields: { ...row }
    };
}
