"use client";
import { useState } from "react";
import { supabase } from "@/lib/connexionSuperbase";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    else router.push("/dashboard");
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
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
        Se connecter
      </button>
    </form>
  );
}
