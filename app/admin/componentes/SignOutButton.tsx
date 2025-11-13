"use client";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-sm text-neutral-500 hover:text-neutral-900 underline"
    >
      Cerrar sesion
    </button>
  );
}
