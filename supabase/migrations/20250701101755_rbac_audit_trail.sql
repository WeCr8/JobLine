-- RBAC: Roles table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- RBAC: Permissions table
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- e.g., 'job:create', 'user:invite'
    description TEXT
);

-- RBAC: Role-Permissions mapping
CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- RBAC: User-Roles mapping (resource-level)
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    resource_id UUID, -- e.g., organization, team, etc.
    resource_type TEXT, -- e.g., 'organization', 'team', etc.
    assigned_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, role_id, resource_id, resource_type)
);

-- Audit Trail
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- e.g., 'job.update', 'user.invite'
    resource_type TEXT NOT NULL, -- e.g., 'job', 'user', 'organization'
    resource_id UUID,
    before JSONB,
    after JSONB,
    reason TEXT,
    ip TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for fast lookup
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_resource ON user_roles(resource_id, resource_type);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_id, resource_type);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id); 