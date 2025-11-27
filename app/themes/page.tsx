import { supabase } from "@/lib/connexionSuperbase";
import Link from "next/link";

export default async function ThemesPage() {
  const { data: themes, error } = await supabase
    .from("theme")
    .select("*")
    .order("libelle");

  if (error) {
    return <p>Erreur lors du chargement des thèmes : {error.message}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Liste des thèmes</h1>

      <Link className="bg-blue-500 text-white p-2 rounded" href="/themes/new">
        Nouveau thème
      </Link>

      <ul className="mt-4 space-y-2">
        {themes?.map((t) => (
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
