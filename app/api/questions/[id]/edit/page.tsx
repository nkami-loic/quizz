import { supabaseAdmin } from "@/lib/connexionSuperbase";

interface Props {
  params: { id: string };
}

export default async function EditQuestionPage({ params }: Props) {
  const { id } = params;

  const { data: question, error: questionError } = await supabaseAdmin()
    .from("question")
    .select("*")
    .eq("id", id)
    .single();

  if (questionError || !question) {
    return <p>Question introuvable</p>;
  }

  const { data: themes } = await supabaseAdmin()
    .from("theme")
    .select("id, libelle")
    .order("libelle", { ascending: true });

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Modifier la question</h1>

      <form
        action={`/api/questions/${id}/update`}
        method="POST"
        className="space-y-4 max-w-md"
      >
        <input
          name="libelle"
          defaultValue={question.libelle}
          placeholder="Libellé de la question"
          className="border p-2 w-full"
          required
        />
        <input
          name="reponse_correcte"
          defaultValue={question.reponse_correcte}
          placeholder="Réponse correcte"
          className="border p-2 w-full"
          required
        />
        <input
          name="reponse_incorrecte_1"
          defaultValue={question.reponse_incorrecte_1}
          placeholder="Réponse incorrecte 1"
          className="border p-2 w-full"
          required
        />
        <input
          name="reponse_incorrecte_2"
          defaultValue={question.reponse_incorrecte_2}
          placeholder="Réponse incorrecte 2"
          className="border p-2 w-full"
          required
        />
        <input
          name="reponse_incorrecte_3"
          defaultValue={question.reponse_incorrecte_3}
          placeholder="Réponse incorrecte 3"
          className="border p-2 w-full"
          required
        />
        <select
          name="theme_id"
          defaultValue={question.theme_id}
          className="border p-2 w-full"
          required
        >
          {themes?.map((t: any) => (
            <option key={t.id} value={t.id}>
              {t.libelle}
            </option>
          ))}
        </select>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Sauvegarder
        </button>
      </form>
    </div>
  );
}
