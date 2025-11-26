"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/connexionSuperbase";
import Link from "next/link";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data } = await supabase
        .from("question")
        .select("id, libelle, theme_id")
        .order("created_at", { ascending: false });

      setQuestions(data || []);
    };
    fetchQuestions();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Liste des questions</h1>

      <Link
        className="bg-blue-500 text-white p-2 rounded"
        href="/questions/new"
      >
        + Nouvelle question
      </Link>

      <ul className="mt-4 space-y-2">
        {questions.map((q) => (
          <li key={q.id} className="p-2 border rounded flex justify-between">
            {q.libelle} (Thème: {q.theme_id})
            <Link href={`/questions/${q.id}/edit`} className="text-blue-600">
              Modifier
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
