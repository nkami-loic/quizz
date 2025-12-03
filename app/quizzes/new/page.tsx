import { supabaseAdmin } from "@/lib/connexionSuperbase";
import Link from "next/link";

export default async function NewQuizSelectThemePage() {
  const { data: themes } = await supabaseAdmin()
    .from("theme")
    .select("id, libelle")
    .order("libelle", { ascending: true });

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Créer un quiz – Choisir un thème</h1>

      <ul className="space-y-2">
        {themes?.map((t) => (
          <li key={t.id} className="p-2 border rounded flex justify-between">
            {t.libelle}

            <Link
              href={`/quizzes/new/${t.id}`}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Choisir
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
