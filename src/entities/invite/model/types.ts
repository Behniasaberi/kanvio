export type Invite = {
  id: string;
  token: string;
  expiresAt: string;
  daysLeft: number;
};

export type InvitePreview = {
  workspaceName: string;
  isExpired: boolean;
};
