"use client";

import { useState } from "react";
import { supabase } from "@/lib/connexionSuperbase";
import { useRouter } from "next/navigation";

export default function NewThemePage() {
  const [libelle, setLibelle] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const createur = session?.user.id;

    await supabase.from("theme").insert({ libelle, createur });
    router.push("/themes");
  }

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Créer un thème</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          className="border p-2 w-full"
          value={libelle}
          onChange={(e) => setLibelle(e.target.value)}
          placeholder="Nom du thème"
          required
        />
        <button className="bg-green-500 text-white p-2 rounded" type="submit">
          Créer
        </button>
      </form>
    </div>
  );
}
