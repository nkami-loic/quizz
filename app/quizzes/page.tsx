import { supabaseAdmin } from "@/lib/connexionSuperbase";
import Link from "next/link";

export default async function QuizzesPage() {
  const { data: quizzes } = await supabaseAdmin()
    .from("quizz")
    .select("id, theme_id, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Liste des quiz</h1>

      <Link href="/quizzes/new" className="bg-blue-500 text-white p-2 rounded">
        + Nouveau quiz
      </Link>

      <ul className="mt-4 space-y-2">
        {quizzes?.map((q: any) => (
          <li key={q.id} className="p-2 border rounded flex justify-between">
            Quiz ID: {q.id} (Thème: {q.theme_id})
            <Link href={`/quizzes/${q.id}/edit`} className="text-blue-600">
              Modifier
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
