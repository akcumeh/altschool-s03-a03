"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const PENDING_KEY = "kk_pending_message";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [reference, setReference] = useState<string | null>(null);
    const injected = useRef(false);

    useEffect(() => {
        if (injected.current) return;
        injected.current = true;

        const ref = searchParams.get("reference") ?? searchParams.get("trxref");
        setReference(ref);

        localStorage.setItem(
            PENDING_KEY,
            "Your payment has been received - thank you! 🎉\n\nYour order is confirmed. Send 1 to start a new order anytime.",
        );
    }, [searchParams]);

    return (
        <div className="flex flex-col h-full bg-[#fdf9f0] overflow-hidden">
            {/* Simulated blurred chat background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
                {/* Header ghost */}
                <div className="h-14 bg-[#404447]/80" />
                {/* Ghost bubbles */}
                <div className="p-4 space-y-3 opacity-40 blur-sm">
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#404447]/60 shrink-0" />
                        <div className="bg-[#404447]/40 rounded-[12px] p-3 w-64 h-16" />
                    </div>
                    <div className="flex justify-end">
                        <div className="bg-[#ffc2d0]/40 border-2 border-[#ffc2d0]/30 rounded-[12px] p-3 w-48 h-12" />
                    </div>
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#404447]/60 shrink-0" />
                        <div className="bg-[#404447]/40 rounded-[12px] p-3 w-56 h-12" />
                    </div>
                </div>
                {/* Dim overlay */}
                <div className="absolute inset-0 bg-[#fdf9f0]/70 backdrop-blur-sm" />
            </div>

            {/* Success modal */}
            <div className="relative z-10 flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-[342px] bg-[#fffbf2] border-2 border-[#404447] rounded-[20px] drop-shadow-[4px_4px_0px_#404447] p-8 flex flex-col items-center text-center">

                    {/* Icon */}
                    <div className="w-16 h-16 rounded-full bg-[#ffc2d0] border-2 border-[#404447] flex items-center justify-center mb-6 drop-shadow-[2px_2px_0px_#404447]">
                        <svg viewBox="0 0 24 18" fill="none" className="w-6 h-[18px]" aria-hidden="true">
                            <path
                                d="M1.5 9 8.5 16 22.5 2"
                                stroke="#404447"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    {/* Heading */}
                    <h1
                        className="text-[#404447] text-[26px] font-bold leading-tight mb-2"
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        Payment Successful!
                    </h1>

                    <p className="text-[#404447]/70 text-sm mb-1">
                        Your order has been confirmed.
                    </p>

                    {reference && (
                        <p className="text-[#404447]/40 text-xs mb-6 font-mono">
                            Ref: {reference}
                        </p>
                    )}
                    {!reference && <div className="mb-6" />}

                    {/* Return button */}
                    <button
                        type="button"
                        onClick={() => router.push("/")}
                        className="key-btn w-full bg-[#404447] border-2 border-[#404447] rounded-[12px] py-4 flex items-center justify-center gap-3 drop-shadow-[2px_2px_0px_#ffc2d0] hover:bg-[#2e3133] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    >
                        <Image
                            src="/assets/apple-touch-icon.png"
                            alt=""
                            width={20}
                            height={20}
                            className="rounded-full opacity-80"
                        />
                        <span
                            className="text-white text-sm font-bold tracking-widest uppercase"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            Return to Chat
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense
            fallback={
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-[#ffc2d0] border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <PaymentSuccessContent />
        </Suspense>
    );
}
