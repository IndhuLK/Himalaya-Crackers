import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate Login
    if(email === "admin@himalaya.com" && password === "admin123") {
        navigate("/dashboard");
    } else {
        alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl shadow-xl shadow-blue-200 mb-6 italic text-4xl font-black text-white">
            H
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">HIMALAYA</h1>
          <p className="text-orange-500 font-bold uppercase tracking-[0.3em] text-xs">Admin Portal</p>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-blue-600 focus:outline-none transition-all font-medium"
                  placeholder="admin@himalaya.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent border-2 rounded-2xl focus:bg-white focus:border-blue-600 focus:outline-none transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2">
              Secure Access <ArrowRight size={20} />
            </button>
          </form>
        </div>

        <p className="text-center text-slate-400 text-sm font-medium flex items-center justify-center gap-2">
          <ShieldCheck size={16} /> Himalayan Enterprise Secure System
        </p>
      </div>
    </div>
  );
}