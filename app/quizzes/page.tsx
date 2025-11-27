"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/connexionSuperbase";
import Link from "next/link";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const { data } = await supabase
        .from("quizz")
        .select("id, theme_id, created_at")
        .order("created_at", { ascending: false });
      setQuizzes(data || []);
    };
    fetchQuizzes();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Liste des quiz</h1>

      <Link href="/quizzes/new" className="bg-blue-500 text-white p-2 rounded">
        + Nouveau quiz
      </Link>

      <ul className="mt-4 space-y-2">
        {quizzes.map((q) => (
          <li key={q.id} className="p-2 border rounded flex justify-between">
            Quiz ID: {q.id} (Thème: {q.theme_id})
            <Link href={`/quizzes/${q.id}/edit`} className="text-blue-600">
              Modifier
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
