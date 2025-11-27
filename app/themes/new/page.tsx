export default function NewThemePage() {
  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Créer un thème</h1>
      <form
        action="/api/themes/create"
        method="POST"
        className="space-y-4 max-w-md"
      >
        <input
          name="libelle"
          className="border p-2 w-full"
          placeholder="Nom du thème"
          required
        />
        <button className="bg-green-500 text-white p-2 rounded" type="submit">
          Créer
        </button>
      </form>
    </div>
  );
}
