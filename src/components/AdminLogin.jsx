import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { KeyRound, Mail } from "lucide-react";
import { Images } from "../constant";
import { motion } from "framer-motion";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      toast.success("Welcome back, admin!");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-4xl bg-zinc-300/5 rounded-lg shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        {/* Left Side - Image */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden md:flex items-center justify-center p-3"
        >
          <img
            src={Images.login1}
            alt="Admin Login"
            className="w-full h-full object-cover rounded-l-lg"
          />
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="p-8 flex flex-col justify-center"
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-300">Admin Login</h2>
            <p className="text-gray-400 mt-2">Sign in to manage your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <div className="mt-1 relative">
                <input
                  placeholder="Enter email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="mt-1 relative">
                <input
                  placeholder="Enter password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <KeyRound className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-2 px-4 bg-[#000] text-white font-medium rounded-md shadow hover:bg-[#000000b5] transition duration-300"
            >
              Sign in
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
