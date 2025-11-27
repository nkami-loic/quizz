"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/connexionSuperbase";
import { useRouter } from "next/navigation";

export default function NewQuizPage() {
  const [themes, setThemes] = useState<any[]>([]);
  const [themeId, setThemeId] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchThemes = async () => {
      const { data } = await supabase.from("theme").select("*");
      setThemes(data || []);
      if (data?.length) setThemeId(data[0].id);
    };
    fetchThemes();
  }, []);

  useEffect(() => {
    if (!themeId) return;
    const fetchQuestions = async () => {
      const { data } = await supabase
        .from("question")
        .select("*")
        .eq("theme_id", themeId);
      setQuestions(data || []);
    };
    fetchQuestions();
  }, [themeId]);

  const toggleQuestion = (id: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(id)
        ? prev.filter((q) => q !== id)
        : prev.length < 10
        ? [...prev, id]
        : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedQuestions.length !== 10) {
      alert("Vous devez sélectionner exactement 10 questions !");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const createur = session?.user.id;

    const { data: quizData, error } = await supabase
      .from("quizz")
      .insert({ theme_id: themeId, createur })
      .select()
      .single();

    if (error || !quizData) {
      alert("Erreur création quiz");
      return;
    }

    const quizzQuestions = selectedQuestions.map((question_id) => ({
      quizz_id: quizData.id,
      question_id,
    }));

    await supabase.from("quizz_question").insert(quizzQuestions);

    router.push("/quizzes");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Créer un quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <select
          value={themeId}
          onChange={(e) => setThemeId(e.target.value)}
          className="border p-2 w-full"
        >
          {themes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.libelle}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-1 gap-2">
          {questions.map((q) => (
            <label key={q.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedQuestions.includes(q.id)}
                onChange={() => toggleQuestion(q.id)}
              />
              <span>{q.libelle}</span>
            </label>
          ))}
        </div>

        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Créer le quiz
        </button>
      </form>
    </div>
  );
}
