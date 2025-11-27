"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/connexionSuperbase";
import { useRouter, useParams } from "next/navigation";
import stringSimilarity from "string-similarity";

export default function PlayQuizPage() {
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<"duo" | "carre" | "cash" | null>(null);
  const [modeLocked, setModeLocked] = useState(false);
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [cashInput, setCashInput] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const loadQuiz = async () => {
      const { data: quizData } = await supabase
        .from("quizz")
        .select("*")
        .eq("id", params.id)
        .single();
      setQuiz(quizData);

      const { data: relations } = await supabase
        .from("quizz_question")
        .select(
          "question(id, libelle, reponse_correcte, reponse_incorrecte_1, reponse_incorrecte_2, reponse_incorrecte_3)"
        )
        .eq("quizz_id", params.id);

      const qs = (relations ?? []).map((r) => r.question);
      setQuestions(qs);
    };

    loadQuiz();
  }, []);

  function chooseMode(selected: "duo" | "carre" | "cash") {
    if (modeLocked) return;
    setMode(selected);
    setModeLocked(true);

    const q = questions[index];

    if (selected === "duo") {
      setSelectedChoices(
        shuffle([
          q.reponse_correcte,
          Math.random() > 0.5 ? q.reponse_incorrecte_1 : q.reponse_incorrecte_2,
        ])
      );
    }

    if (selected === "carre") {
      setSelectedChoices(
        shuffle([
          q.reponse_correcte,
          q.reponse_incorrecte_1,
          q.reponse_incorrecte_2,
          q.reponse_incorrecte_3,
        ])
      );
    }
  }

  function shuffle(arr: any[]) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function checkAnswer(answer?: string) {
    const q = questions[index];
    let correct = false;

    if (mode === "cash") {
      const similarity = stringSimilarity.compareTwoStrings(
        cashInput.trim().toLowerCase(),
        q.reponse_correcte.trim().toLowerCase()
      );
      correct = similarity > 0.7;
    } else {
      correct = answer === q.reponse_correcte;
    }

    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      goNext();
    }, 800);
  }
  async function goNext() {
    if (index + 1 >= questions.length) {
      await saveRun();
      setFinished(true);
      return;
    }

    setIndex((i) => i + 1);
    setMode(null);
    setModeLocked(false);
    setSelectedChoices([]);
    setCashInput("");
  }

  async function saveRun() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return router.push("/login");

    await supabase.from("run").insert({
      quizz_id: params.id,
      joueur: session.user.id,
      score,
    });
    console.log("quizz_id", params.id);
    console.log("joueur", session.user.id);
    console.log("score", score);
  }

  if (finished) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold">Quiz terminé 🎉</h1>
        <p className="text-xl mt-4">
          Score : <strong>{score}</strong> / {questions.length}
        </p>

        <button
          onClick={() => router.push("/quizzes")}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Retour aux quizzes
        </button>
      </div>
    );
  }

  if (!questions.length) return <p className="p-4">Chargement du quiz…</p>;

  const q = questions[index];

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">
        Question {index + 1} / {questions.length}
      </h1>

      <p className="text-lg mb-4">{q.libelle}</p>

      <div className="flex gap-2 mb-4">
        <button
          disabled={modeLocked}
          onClick={() => chooseMode("duo")}
          className="px-3 py-2 bg-purple-600 text-white rounded disabled:opacity-50 "
        >
          Duo
        </button>
        <button
          disabled={modeLocked}
          onClick={() => chooseMode("carre")}
          className="px-3 py-2 bg-orange-600 text-white rounded disabled:opacity-50"
        >
          Carré
        </button>
        <button
          disabled={modeLocked}
          onClick={() => chooseMode("cash")}
          className="px-3 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          Cash
        </button>
      </div>

      {(mode === "duo" || mode === "carre") && (
        <div className="space-y-2">
          {selectedChoices.map((c) => (
            <button
              key={c}
              onClick={() => checkAnswer(c)}
              className="block w-full p-2 border rounded bg-gray-100 text-black"
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {mode === "cash" && (
        <div className="mt-4">
          <input
            value={cashInput}
            onChange={(e) => setCashInput(e.target.value)}
            placeholder="Votre réponse"
            className="border p-2 w-full"
          />
          <button
            onClick={() => checkAnswer()}
            className="mt-2 px-3 py-2 bg-blue-500 text-white rounded"
          >
            Valider
          </button>
        </div>
      )}
    </div>
  );
}
