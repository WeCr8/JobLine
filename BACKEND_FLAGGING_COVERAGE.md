# Backend Consistency Flagging & Audit Coverage Log

This file tracks all backend mutation points (create, update, delete, import) across all services in JobLin.ai. Use it to ensure every critical action is covered by:
- Validation
- Consistency flagging (`logConsistencyFlag`)
- Audit logging (`logAudit`)
- RBAC/permission checks (`canAccess`)

---

## Jobs Service (`jobs.service.ts`)
- [x] `updateJobStatus` — Validation, flagging, audit, RBAC ✅
- [ ] `updateJobProgress` — TODO: Add flagging, audit, RBAC
- [ ] `addJob` (if present) — TODO: Add validation, flagging, audit, RBAC
- [ ] `deleteJob` (if present) — TODO: Add referential check, flagging, audit, RBAC

## Organization Service (`organization.service.ts`)
- [x] `updateOrganization` — Audit, RBAC ✅
- [ ] `inviteUser` — TODO: Add audit, RBAC, flagging
- [ ] `cancelInvite` — TODO: Add audit, RBAC, flagging
- [ ] `updateUser` — TODO: Add audit, RBAC, flagging
- [ ] `addDepartment` — TODO: Add validation, flagging, audit, RBAC

## Integration Service (`integration.service.ts`)
- [x] `processImportData` — Validation, flagging ✅
- [ ] Other import/mapping methods — TODO: Review for flagging, audit, RBAC

## Admin Service (`admin.service.ts`)
- [ ] `saveSubscriptionPlan` — TODO: Add audit, RBAC, flagging
- [ ] `saveOrganization` — TODO: Add audit, RBAC, flagging
- [ ] `updateUser` — TODO: Add audit, RBAC, flagging

## Other Services (passdown, settings, subscription, etc.)
- [ ] Review all mutation points for validation, flagging, audit, RBAC

---

## How to Use This Log
- Check off each method as you add/verify validation, flagging, audit, and RBAC.
- For each TODO, add the missing logic and update this file.
- Use this as a reference for onboarding, QA, and future audits.

---

**Goal:** 100% backend coverage for data integrity, security, and auditability. 