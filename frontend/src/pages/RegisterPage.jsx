import { useState } from "react";
import api from "../api/axios";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const submit = async () => {
    await api.post("/auth/register", { email, password: pass });
    window.location.href = "/login";
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl mb-4 font-bold">Register</h1>

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

      <button className="bg-green-600 text-white p-2 mt-3 w-full" onClick={submit}>
        Register
      </button>
    </div>
  );
};

export default RegisterPage;
