// Where to send the user after login (e.g. back to an invite link).
export const NEXT_PATH_COOKIE = "kanvio_next";

/** Only allow same-site paths like "/invite/abc", never "//evil.com". */
export function isSafeNextPath(path: string | undefined): path is string {
  return Boolean(path && path.startsWith("/") && !path.startsWith("//"));
}
