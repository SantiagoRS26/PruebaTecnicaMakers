"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getLoans, createLoan, approveLoan, rejectLoan } from "@/lib/api";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Roles } from "@/lib/roles";

export default function LoansPage() {
	const { user, token, isInitialized } = useAuth();
	const [loans, setLoans] = useState([]);
	const [error, setError] = useState("");
	const [amount, setAmount] = useState("");
	const router = useRouter();

	const fetchLoans = useCallback(async () => {
		try {
			const data = await getLoans(token);
			const filteredLoans =
				user.role === Roles.ADMIN
					? data
					: data.filter((loan) => loan.userId === user.id);
			setLoans(filteredLoans);
		} catch (err) {
			setError("Failed to fetch loans");
		}
	}, [token, user]);

	useEffect(() => {
		if (!isInitialized) return;
		if (!user || !token) {
			router.push("/login");
			return;
		}
		fetchLoans();
	}, [token, user, router, isInitialized, fetchLoans]);

	if (!isInitialized) {
		return <p>Loading...</p>;
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="p-6">
			<div className="flex items-center justify-between mb-4">
				<h1 className="text-2xl font-bold">
					{user.role === Roles.ADMIN ? "All Loan Requests" : "My Loan Requests"}
				</h1>
				<button
					onClick={fetchLoans}
					className="bg-gray-200 p-2 rounded hover:bg-gray-300 transition">
					Refresh
				</button>
			</div>
			{error && <p className="text-red-500 mb-4">{error}</p>}

			{user.role !== Roles.ADMIN && (
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						setError("");
						try {
							const newLoan = await createLoan(
								{ amount: parseFloat(amount), userId: user.id },
								token
							);
							setLoans([...loans, newLoan]);
							setAmount("");
						} catch (err) {
							setError("Failed to create loan");
						}
					}}
					className="mb-6">
					<input
						type="number"
						placeholder="Loan Amount"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className="border border-gray-300 p-2 rounded mr-2"
						required
					/>
					<button
						type="submit"
						className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition">
						Request Loan
					</button>
				</form>
			)}

			<div className="space-y-4">
				{loans.map((loan) => (
					<div
						key={loan.id}
						className="p-4 border rounded flex justify-between items-center">
						<div>
							<p>
								<strong>Loan ID:</strong> {loan.id}
							</p>
							<p>
								<strong>Amount:</strong> ${loan.amount}
							</p>
							<p>
								<strong>Status:</strong> {loan.status}
							</p>
						</div>
						{user.role === Roles.ADMIN && loan.status === "Pending" && (
							<div className="flex space-x-2">
								<button
									onClick={() =>
										approveLoan(loan.id, token)
											.then(() => {
												setLoans(
													loans.map((l) =>
														l.id === loan.id ? { ...l, status: "Approved" } : l
													)
												);
											})
											.catch(() => setError("Failed to approve loan"))
									}
									className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
									Approve
								</button>
								<button
									onClick={() =>
										rejectLoan(loan.id, token)
											.then(() => {
												setLoans(
													loans.map((l) =>
														l.id === loan.id ? { ...l, status: "Rejected" } : l
													)
												);
											})
											.catch(() => setError("Failed to reject loan"))
									}
									className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition">
									Reject
								</button>
							</div>
						)}
					</div>
				))}
			</div>
		</motion.div>
	);
}
