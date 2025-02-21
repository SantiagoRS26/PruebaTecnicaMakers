"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();
	const { login } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		try {
			const data = await loginUser({ email, password });
			login(
				{ email: data.email, role: data.role, id: data.userId },
				data.token
			);
			router.push("/loans");
		} catch (err) {
			setError(err.message || "Login failed");
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			className="min-h-screen flex items-center justify-center bg-gray-100">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-6 rounded shadow-md w-full max-w-sm">
				<h2 className="text-xl font-bold mb-4">Login</h2>
				{error && <p className="text-red-500 mb-4">{error}</p>}
				<div className="mb-4">
					<label className="block text-gray-700">Email</label>
					<input
						type="email"
						className="mt-1 block w-full border border-gray-300 rounded p-2"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700">Password</label>
					<input
						type="password"
						className="mt-1 block w-full border border-gray-300 rounded p-2"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<button
					type="submit"
					className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
					Login
				</button>
			</form>
		</motion.div>
	);
}
