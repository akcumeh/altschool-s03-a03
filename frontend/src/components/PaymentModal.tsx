"use client";

interface PaymentModalProps {
    url: string;
    onClose: () => void;
}

export default function PaymentModal({ url, onClose }: PaymentModalProps) {
    function openPaystack() {
        window.open(url, "_blank", "noopener,noreferrer");
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label="Complete your payment"
        >
            {/* Backdrop — blurs chat content behind it */}
            <div
                className="absolute inset-0 bg-[#2b2e31]/65 backdrop-blur-[5px]"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Card */}
            <div className="relative w-full sm:max-w-[360px] bg-[#fff6e8] border border-[#3f4347]/15 rounded-t-[22px] sm:rounded-[20px] px-6 pt-7 pb-8 shadow-[0_-8px_40px_rgba(0,0,0,0.3)] mx-0 sm:mx-4">

                {/* Close */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#3f4347]/8 flex items-center justify-center hover:bg-[#3f4347]/15 transition-colors"
                >
                    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
                        <path d="m4 4 8 8M12 4 4 12" stroke="#3f4347" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>

                <h2
                    className="text-[#3f4347] text-lg font-semibold mb-1 leading-tight"
                    style={{ fontFamily: "var(--font-mono)" }}
                >
                    Complete Payment
                </h2>
                <p className="text-[#3f4347]/55 text-sm mb-6 leading-[1.55]">
                    You&apos;ll be taken to Paystack&apos;s secure checkout in a new tab.
                    Return here after paying — your confirmation appears in chat.
                </p>

                {/* Pay button */}
                <button
                    type="button"
                    onClick={openPaystack}
                    className="key-btn w-full bg-[#ff9eb6] border border-[#3f4347]/10 rounded-[12px] py-3.5 px-4 flex items-center justify-center gap-2.5 shadow-[0_2px_0_0_rgba(63,67,71,0.2)] hover:brightness-97"
                >
                    <svg viewBox="0 0 24 28" fill="none" className="w-4 h-5 shrink-0" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="22" rx="3" fill="#3f4347" />
                        <rect x="7" y="7" width="10" height="5" rx="1" fill="#ff9eb6" />
                        <rect x="7" y="15" width="7" height="4" rx="1" fill="#ff9eb6" opacity="0.7" />
                    </svg>
                    <span
                        className="text-[#3f4347] text-sm font-semibold tracking-wide"
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        Pay with Paystack
                    </span>
                    <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 ml-auto shrink-0 opacity-50" aria-hidden="true">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="#3f4347" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <p className="text-center text-[10px] text-[#3f4347]/35 mt-3">
                    Opens in a new tab · Secured by Paystack
                </p>
            </div>
        </div>
    );
}
