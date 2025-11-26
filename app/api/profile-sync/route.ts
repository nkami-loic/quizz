import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/connexionSuperbase";

export async function POST(req: Request) {
  const body = await req.json();
  const { user_id, pseudo } = body;

  if (!user_id || !pseudo)
    return NextResponse.json({ error: "missing" }, { status: 400 });

  const sb = supabaseAdmin();
  const { error } = await sb.from("profiles").insert({ id: user_id, pseudo });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
