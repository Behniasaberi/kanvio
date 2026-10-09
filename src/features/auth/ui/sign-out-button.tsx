import { signOut } from "../api/actions";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="h-8 rounded-md border border-zinc-800 px-3 text-sm text-zinc-300 transition-colors hover:bg-zinc-900"
      >
        Log out
      </button>
    </form>
  );
}
