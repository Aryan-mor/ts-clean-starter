// Branded types: a plain string can't be passed where a UserId is expected,
// and a UserId can't be passed where an OrgId is expected.
// The brand field only exists for TypeScript, never at runtime.
export type UserId = string & { readonly __UserId__: true };
export type OrgId = string & { readonly __OrgId__: true };

// The only places where a plain string becomes an ID.
// Call them after the value is validated (parsed request, DB row, ...).
export const toUserId = (value: string): UserId => value as UserId;
export const toOrgId = (value: string): OrgId => value as OrgId;
