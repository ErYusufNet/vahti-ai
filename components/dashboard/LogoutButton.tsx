import { signOut } from "@/auth";

/**
 * Uloskirjautuminen palvelintoiminnolla (Auth.js v5:n suositeltu tapa
 * App Routerissa). Nappi lähettää lomakkeen → signOut → ohjaus etusivulle.
 */
export function LogoutButton({ label }: { label: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button type="submit" className="dash-logout">
        {label}
      </button>
    </form>
  );
}
