import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/connexionSuperbase";

export async function POST(req: Request) {
  const formData = await req.formData();
  const libelle = formData.get("libelle") as string;

  if (!libelle)
    return NextResponse.json({ error: "Libellé manquant" }, { status: 400 });

  const sb = supabaseAdmin();
  const { error } = await sb.from("theme").insert({ libelle });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.redirect(new URL("/themes", req.url));
}
