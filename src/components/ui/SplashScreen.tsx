import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    key="splash"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="flex flex-col items-center justify-center h-screen bg-white absolute inset-0 z-50"
                >
                    {/* Logo */}
                    <motion.img
                        src="../../assets/calendar.png"
                        alt="App Logo"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="w-24 h-24 mb-4"
                    />

                    {/* Animated Text */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-2xl font-bold text-indigo-600"
                    >
                        Attendance Tracker
                    </motion.h1>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
