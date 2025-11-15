import { useState } from "react";
import api from "../api/axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const submit = async () => {
    await api.post("/auth/login", { email, password: pass });
    localStorage.setItem("logged", "true");
    window.location.href = "/";
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl mb-4 font-bold">Login</h1>

      <input
        className="border p-2 w-full"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 w-full mt-2"
        placeholder="Password"
        type="password"
        onChange={(e) => setPass(e.target.value)}
      />

      <button className="bg-blue-600 text-white p-2 mt-3 w-full" onClick={submit}>
        Login
      </button>
    </div>
  );
};

export default LoginPage;
