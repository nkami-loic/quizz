"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/connexionSuperbase";
import { useRouter } from "next/navigation";
export default function NewQuestionPage() {
  const [libelle, setLibelle] = useState("");
  const [reponseCorrecte, setReponseCorrecte] = useState("");
  const [reponse1, setReponse1] = useState("");
  const [reponse2, setReponse2] = useState("");
  const [reponse3, setReponse3] = useState("");
  const [themes, setThemes] = useState<any[]>([]);
  const [themeId, setThemeId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchThemes = async () => {
      const { data } = await supabase.from("theme").select("*");
      setThemes(data || []);
      if (data?.length) setThemeId(data[0].id);
    };
    fetchThemes();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const createur = session?.user.id;

    await supabase.from("question").insert({
      libelle,
      reponse_correcte: reponseCorrecte,
      reponse_incorrecte_1: reponse1,
      reponse_incorrecte_2: reponse2,
      reponse_incorrecte_3: reponse3,
      theme_id: themeId,
      createur,
    });

    router.push("/questions");
  }

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Créer une question</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          placeholder="Libellé de la question"
          value={libelle}
          onChange={(e) => setLibelle(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <input
          placeholder="Réponse correcte"
          value={reponseCorrecte}
          onChange={(e) => setReponseCorrecte(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <input
          placeholder="Réponse incorrecte 1"
          value={reponse1}
          onChange={(e) => setReponse1(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <input
          placeholder="Réponse incorrecte 2"
          value={reponse2}
          onChange={(e) => setReponse2(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <input
          placeholder="Réponse incorrecte 3"
          value={reponse3}
          onChange={(e) => setReponse3(e.target.value)}
          required
          className="border p-2 w-full"
        />
        <select
          value={themeId}
          onChange={(e) => setThemeId(e.target.value)}
          className="border p-2 w-full"
        >
          {themes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.libelle}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Créer
        </button>
      </form>
    </div>
  );
}
