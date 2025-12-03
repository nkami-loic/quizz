import { supabaseAdmin } from "@/lib/connexionSuperbase";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NewQuizWithQuestionsPage(props: Props) {
  const { id: themeId } = await props.params;

  const { data: theme } = await supabaseAdmin()
    .from("theme")
    .select("id, libelle")
    .eq("id", themeId)
    .single();

  const { data: questions } = await supabaseAdmin()
    .from("question")
    .select("id, libelle")
    .eq("theme_id", themeId);

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Créer un quiz – {theme?.libelle}</h1>

      <form method="POST" action="/api/quizzes/create" className="space-y-4">
        <input type="hidden" name="theme_id" value={themeId} />

        <div className="space-y-2">
          {questions?.map((q) => (
            <label key={q.id} className="flex items-center gap-2">
              <input type="checkbox" name="questions" value={q.id} />
              {q.libelle}
            </label>
          ))}
        </div>

        <button className="bg-green-500 text-white p-2 rounded">
          Créer le quiz
        </button>
      </form>
    </div>
  );
}
