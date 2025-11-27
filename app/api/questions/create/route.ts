import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/connexionSuperbase";

export async function POST(req: Request) {
  const formData = await req.formData();
  const libelle = formData.get("libelle") as string;
  const reponse_correcte = formData.get("reponse_correcte") as string;
  const reponse_incorrecte_1 = formData.get("reponse_incorrecte_1") as string;
  const reponse_incorrecte_2 = formData.get("reponse_incorrecte_2") as string;
  const reponse_incorrecte_3 = formData.get("reponse_incorrecte_3") as string;
  const theme_id = formData.get("theme_id") as string;

  if (
    !libelle ||
    !reponse_correcte ||
    !reponse_incorrecte_1 ||
    !reponse_incorrecte_2 ||
    !reponse_incorrecte_3 ||
    !theme_id
  ) {
    return NextResponse.json(
      { error: "Tous les champs sont obligatoires" },
      { status: 400 }
    );
  }

  const sb = supabaseAdmin();
  const { error } = await sb.from("question").insert({
    libelle,
    reponse_correcte,
    reponse_incorrecte_1,
    reponse_incorrecte_2,
    reponse_incorrecte_3,
    theme_id,
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.redirect(new URL("/questions", req.url));
}
