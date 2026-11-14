import type { OrgId, UserId } from "./ids.js";

export interface User {
  readonly id: UserId;
  readonly orgId: OrgId;
  readonly name: string;
  readonly email: string;
}

export const formatUser = (user: User): string => `${user.name} <${user.email}>`;
