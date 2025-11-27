"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/connexionSuperbase";
import { useParams } from "next/navigation";

export default function HallOfFame() {
  const params = useParams();
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      const { data, error } = await supabase
        .from("run")
        .select("score, joueur (pseudo)")
        .eq("quizz_id", params.id)
        .order("score", { ascending: false })
        .limit(10);

      if (error) {
        console.error(error);
        setScores([]);
      } else {
        setScores(data || []);
      }

      setLoading(false);
    };

    fetchScores();
  }, [params.id]);

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Hall of Fame - Quiz {params.id}</h1>

      {scores.length === 0 && <p>Aucun score pour ce quiz.</p>}

      <ul className="space-y-2">
        {scores.map((s, index) => (
          <li key={index} className="p-2 border rounded flex justify-between">
            <span>
              {index + 1}. {s.joueur.pseudo}
            </span>
            <span>{s.score} points</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
