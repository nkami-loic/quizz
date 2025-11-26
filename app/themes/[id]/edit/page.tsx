"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/connexionSuperbase";
import { useRouter, useParams } from "next/navigation";

export default function EditThemePage() {
  const [libelle, setLibelle] = useState("");
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("theme")
        .select("*")
        .eq("id", params.id)
        .single();
      if (data) setLibelle(data.libelle);
    };

    load();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await supabase.from("theme").update({ libelle }).eq("id", params.id);

    router.push("/themes");
  }

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Modifier un thème</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          className="border p-2 w-full"
          value={libelle}
          onChange={(e) => setLibelle(e.target.value)}
          required
        />
        <button className="bg-blue-500 text-white p-2 rounded" type="submit">
          Sauvegarder
        </button>
      </form>
    </div>
  );
}
