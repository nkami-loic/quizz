"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/connexionSuperbase";

export default function Dashboard() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
  }, []);

  if (!session) return <p>Chargement...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl">Bienvenue {session.user.email}</h1>
      <button
        onClick={() => supabase.auth.signOut()}
        className="mt-4 p-2 bg-red-500 text-white"
      >
        Se déconnecter
      </button>
    </div>
  );
}
