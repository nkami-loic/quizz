import Link from "next/link";
import { supabaseAdmin } from "@/lib/connexionSuperbase";

interface Question {
  id: string;
  libelle: string;
}

export default async function QuestionsPage() {
  const supabase = supabaseAdmin();

  const { data } = await supabase
    .from("question")
    .select("id, libelle, theme:theme_id(libelle)")
    .order("created_at", { ascending: false });

  const questions = (data || []) as Question[];

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Liste des questions</h1>

      <Link
        className="bg-blue-500 text-white p-2 rounded"
        href="/questions/new"
      >
        Nouvelle question
      </Link>

      <ul className="mt-4 space-y-2">
        {questions.map((q) => (
          <li key={q.id} className="p-2 border rounded flex justify-between">
            <div>
              <strong>{q.libelle}</strong>
            </div>

            <Link href={`/questions/${q.id}/edit`} className="text-blue-600">
              Modifier
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
