"use client";

import { useState } from "react";
import { supabase } from "@/lib/connexionSuperbase";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const res = await fetch("/api/profile-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: data.user?.id, pseudo }),
    });

    if (!res.ok) alert("Erreur création profil");
    else router.push("/login");
    alert("Inscription réussie");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input
        value={pseudo}
        onChange={(e) => setPseudo(e.target.value)}
        placeholder="Pseudo"
        required
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        required
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        type="password"
        required
      />
      <button type="submit" disabled={loading}>
        S'inscrire
      </button>
    </form>
  );
}
