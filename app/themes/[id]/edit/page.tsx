import { supabaseAdmin } from "@/lib/connexionSuperbase";

interface Props {
  params: { id: string };
}

export default async function EditThemePage({ params }: Props) {
  const { id } = await params;

  const { data: theme, error } = await supabaseAdmin()
    .from("theme")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !theme) {
    return <p>Thème introuvable</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Modifier le thème</h1>
      <form
        action={`/api/themes/${id}/update`}
        method="POST"
        className="space-y-4 max-w-md"
      >
        <input
          name="libelle"
          defaultValue={theme.libelle}
          className="border p-2 w-full"
          required
        />
        <button className="bg-blue-500 text-white p-2 rounded" type="submit">
          Sauvegarder
        </button>
      </form>
    </div>
  );
}
