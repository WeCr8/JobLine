import { supabase } from '../services/api.service';
// XSS-safe HTML escaping
export function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
// Input sanitization (basic, strips script/style tags and dangerous attributes)
export function sanitizeInput(str) {
    // Remove script/style tags
    let sanitized = str.replace(/<\/?(script|style)[^>]*>/gi, '');
    // Remove on* attributes (e.g., onclick)
    sanitized = sanitized.replace(/ on\w+\s*=\s*(['"]).*?\1/gi, '');
    // Remove javascript: and data: URIs
    sanitized = sanitized.replace(/(javascript:|data:)/gi, '');
    return sanitized;
}
// JWT decode (no validation, just decode payload)
export function decodeJwt(token) {
    try {
        const payload = token.split('.')[1];
        if (!payload)
            return null;
        return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    }
    catch {
        return null;
    }
}
// JWT validate (exp, nbf, iat)
export function isJwtValid(token) {
    const payload = decodeJwt(token);
    if (!payload)
        return false;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp)
        return false;
    if (payload.nbf && now < payload.nbf)
        return false;
    if (payload.iat && now < payload.iat)
        return false;
    return true;
}
// Permission checking utility (full RBAC)
export async function canAccess(user, permission, resource) {
    if (!user || !user.id) {
        console.warn('[RBAC] No user provided');
        return false;
    }
    // Get all user_roles for this user (optionally scoped to resource)
    let userRolesQuery = supabase
        .from('user_roles')
        .select('role_id, resource_id, resource_type');
    userRolesQuery = userRolesQuery.eq('user_id', user.id);
    if (resource && resource.id && resource.type) {
        userRolesQuery = userRolesQuery.eq('resource_id', resource.id).eq('resource_type', resource.type);
    }
    const { data: userRoles, error: userRolesError } = await userRolesQuery;
    if (userRolesError) {
        console.error('[RBAC] Failed to fetch user_roles:', userRolesError);
        return false;
    }
    if (!userRoles || userRoles.length === 0) {
        console.warn('[RBAC] No roles found for user', user.id);
        return false;
    }
    // Get all permissions for these roles
    const roleIds = userRoles.map((ur) => ur.role_id);
    const { data: rolePerms, error: rolePermsError } = await supabase
        .from('role_permissions')
        .select('permission_id')
        .in('role_id', roleIds);
    if (rolePermsError) {
        console.error('[RBAC] Failed to fetch role_permissions:', rolePermsError);
        return false;
    }
    if (!rolePerms || rolePerms.length === 0) {
        console.warn('[RBAC] No permissions found for user roles', roleIds);
        return false;
    }
    const permIds = rolePerms.map((rp) => rp.permission_id);
    const { data: perms, error: permsError } = await supabase
        .from('permissions')
        .select('name')
        .in('id', permIds);
    if (permsError) {
        console.error('[RBAC] Failed to fetch permissions:', permsError);
        return false;
    }
    if (!perms || perms.length === 0) {
        console.warn('[RBAC] No permissions found for user', user.id);
        return false;
    }
    const permNames = perms.map((p) => p.name);
    const hasPerm = permNames.includes(permission);
    if (!hasPerm) {
        console.warn('[RBAC] Permission denied', { user: user.id, permission, resource });
    }
    return hasPerm;
}
