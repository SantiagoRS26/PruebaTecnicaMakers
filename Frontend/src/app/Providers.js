"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";

export default function Providers({ children }) {
    return (
        <AuthProvider>
            <ThemeProvider attribute="class">
                <AnimatePresence>{children}</AnimatePresence>
            </ThemeProvider>
        </AuthProvider>
    );
}
