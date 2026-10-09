import { Button } from "@/shared/ui";
import { signOut } from "../api/actions";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="secondary" size="sm">
        Log out
      </Button>
    </form>
  );
}
