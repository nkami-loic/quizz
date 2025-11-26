"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/connexionSuperbase";
import Link from "next/link";

export default function ThemesPage() {
  const [themes, setThemes] = useState<any[]>([]);

  useEffect(() => {
    const fetchThemes = async () => {
      const { data } = await supabase.from("theme").select("*");
      setThemes(data || []);
    };
    fetchThemes();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Liste des thèmes</h1>

      <Link className="bg-blue-500 text-white p-2 rounded" href="/themes/new">
        + Nouveau thème
      </Link>

      <ul className="mt-4 space-y-2">
        {themes.map((t) => (
          <li key={t.id} className="p-2 border rounded flex justify-between">
            {t.libelle}
            <Link href={`/themes/${t.id}/edit`} className="text-blue-600">
              Modifier
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
