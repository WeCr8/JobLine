-- Consistency/Data Issue Flag Table
CREATE TABLE consistency_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- e.g., 'referential', 'validation', 'permission_denial', 'anomaly'
    severity TEXT NOT NULL, -- e.g., 'info', 'warning', 'error', 'critical'
    resource_type TEXT NOT NULL, -- e.g., 'job', 'operation', 'user', etc.
    resource_id UUID,
    context JSONB, -- Additional context/details
    detected_by TEXT, -- e.g., 'service', 'background_job', 'user', etc.
    detected_at TIMESTAMPTZ DEFAULT now(),
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID,
    notes TEXT
);

-- Indexes for fast lookup
CREATE INDEX idx_flags_resource ON consistency_flags(resource_id, resource_type);
CREATE INDEX idx_flags_type_severity ON consistency_flags(type, severity);
CREATE INDEX idx_flags_resolved ON consistency_flags(resolved); 