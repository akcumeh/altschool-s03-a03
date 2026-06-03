"use client";

import { useEffect, useRef, useState } from "react";

interface EmailInputBarProps {
    onSend: (email: string) => void;
    disabled?: boolean;
}

export default function EmailInputBar({ onSend, disabled = false }: EmailInputBarProps) {
    const [email, setEmail] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    /* Auto-focus → surfaces mobile email keyboard immediately */
    useEffect(() => {
        const t = setTimeout(() => inputRef.current?.focus(), 100);
        return () => clearTimeout(t);
    }, []);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const trimmed = email.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setEmail("");
    }

    return (
        /* Charcoal (#575b5f) background — as specified in design brief */
        <div className="shrink-0 bg-[#575b5f] px-4 pt-3 pb-5">
            <p className="text-white/40 text-[10px] text-center mb-2 leading-4 tracking-wide uppercase"
                style={{ fontFamily: "var(--font-mono)" }}>
                Enter your email to pay
            </p>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                    ref={inputRef}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={disabled}
                    className="flex-1 h-11 rounded-[10px] border border-white/20 bg-white/12 px-4 text-sm text-white placeholder-white/30 outline-none focus:border-[#ff9eb6]/60 focus:bg-white/18 disabled:opacity-50 transition-colors"
                    style={{ fontFamily: "var(--font-sans)" }}
                />
                <button
                    type="submit"
                    disabled={disabled || !email.trim()}
                    aria-label="Send email"
                    className="key-btn shrink-0 w-11 h-11 rounded-[10px] bg-[#ff9eb6] flex items-center justify-center shadow-[0_2px_0_0_rgba(0,0,0,0.25)] hover:brightness-97 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden="true">
                        <path
                            d="M3 10h14M10 3l7 7-7 7"
                            stroke="#3f4347"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </form>
        </div>
    );
}
