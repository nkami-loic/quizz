import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/connexionSuperbase";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const themeId = formData.get("theme_id");
    const questions = formData.getAll("questions");

    const admin = supabaseAdmin();
    const { data: quiz, error: quizError } = await admin
      .from("quizz")
      .insert({ theme_id: themeId })
      .select()
      .single();

    if (quizError) {
      console.error(quizError);
      return NextResponse.json(
        { error: "Erreur création quiz" },
        { status: 500 }
      );
    }

    const qzQuestions = questions.map((q: any) => ({
      quizz_id: quiz.id,
      question_id: q,
    }));

    await admin.from("quizz_question").insert(qzQuestions);

    return NextResponse.redirect(new URL("/quizzes", req.url));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
