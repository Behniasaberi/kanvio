export type Workspace = {
  id: string;
  name: string;
  slug: string;
};

export type MemberRole = "owner" | "admin" | "member";

export type WorkspaceMember = {
  id: string;
  name: string;
  role: MemberRole;
};
