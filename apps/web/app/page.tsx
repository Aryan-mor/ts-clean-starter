import { toOrgId, toUserId } from "@packages/shared/ids";
import { formatUser, type User } from "@packages/shared/user";
import { Button } from "@packages/ui/button";

const demoUser: User = {
  id: toUserId("u_1"),
  orgId: toOrgId("o_1"),
  name: "Ada Lovelace",
  email: "ada@example.com",
};

const HomePage = () => (
  <main style={{ display: "grid", gap: 16, padding: 32 }}>
    <h1>ts-clean-starter</h1>
    <p>Signed in as {formatUser(demoUser)}</p>
    <div style={{ display: "flex", gap: 8 }}>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
    </div>
  </main>
);

export default HomePage;
