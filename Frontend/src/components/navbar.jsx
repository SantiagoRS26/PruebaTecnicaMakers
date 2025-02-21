"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Roles } from "@/lib/roles";

export default function Navbar() {
	const { user, logout } = useAuth();

	return (
		<nav className="bg-white shadow py-4 px-6 flex justify-between items-center">
			<div>
				<Link href="/">
					<span className="font-bold text-xl">Loan System</span>
				</Link>
			</div>
			<div className="flex space-x-4">
				{user ? (
					<>
						<Link href="/loans">
							<span className="hover:text-blue-600">Loans</span>
						</Link>
						{user.role === Roles.ADMIN && (
							<Link href="/loans">
								<span className="hover:text-blue-600">Admin Panel</span>
							</Link>
						)}
						<button
							onClick={logout}
							className="text-red-500 hover:text-red-700">
							Logout
						</button>
					</>
				) : (
					<>
						<Link href="/login">
							<span className="hover:text-blue-600">Login</span>
						</Link>
						<Link href="/register">
							<span className="hover:text-blue-600">Register</span>
						</Link>
					</>
				)}
			</div>
		</nav>
	);
}
