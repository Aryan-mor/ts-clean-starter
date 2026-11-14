import { Hono } from "hono";
import { toOrgId, toUserId } from "@packages/shared/ids";
import { formatUser, type User } from "@packages/shared/user";

// The app is separate from the server, so tests can call app.request() directly.
export const app = new Hono();

app.get("/", (c) => c.json({ ok: true }));

app.get("/users/:id", (c) => {
  const user: User = {
    id: toUserId(c.req.param("id")),
    orgId: toOrgId("o_1"),
    name: "Ada Lovelace",
    email: "ada@example.com",
  };
  return c.json({ ...user, label: formatUser(user) });
});
