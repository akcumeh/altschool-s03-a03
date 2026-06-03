import Image from "next/image";
import type { MenuItem, OrderItem } from "@/types/chat";

interface BotBubbleProps {
    text: string;
    menuItems?: MenuItem[];
    orderItems?: OrderItem[];
    orderTotal?: string;
    paystackUrl?: string;
    onPaystackClick?: (url: string) => void;
    onMenuItemClick?: (num: number) => void;
}

export default function BotBubble({
    text,
    menuItems,
    orderItems,
    orderTotal,
    paystackUrl,
    onPaystackClick,
    onMenuItemClick,
}: BotBubbleProps) {
    return (
        <div className="flex gap-2.5 items-end">
            {/* Avatar */}
            <div className="shrink-0 w-7 h-7 rounded-full bg-[#3f4347] border border-[#ff9eb6]/40 overflow-hidden flex items-center justify-center self-start mt-0.5">
                <Image
                    src="/assets/apple-touch-icon.png"
                    alt=""
                    width={28}
                    height={28}
                    className="object-cover w-full h-full"
                />
            </div>

            {/* Content column */}
            <div className="flex-1 min-w-0 flex flex-col gap-2">
                {/* Main bubble */}
                <div className="bg-[#3f4347] rounded-[14px] rounded-bl-[4px] p-3.5">
                    {menuItems?.length ? (
                        <MenuContent
                            menuItems={menuItems}
                            text={text}
                            onItemClick={onMenuItemClick}
                        />
                    ) : orderItems?.length ? (
                        <ReceiptContent
                            text={text}
                            orderItems={orderItems}
                            orderTotal={orderTotal}
                        />
                    ) : (
                        <PlainContent text={text} />
                    )}
                </div>

                {/* Paystack CTA — rendered outside the bubble */}
                {paystackUrl && onPaystackClick && (
                    <button
                        type="button"
                        onClick={() => onPaystackClick(paystackUrl)}
                        className="key-btn w-full bg-[#ff9eb6] border border-[#3f4347]/20 rounded-[12px] py-3.5 px-4 flex items-center justify-center gap-2.5 shadow-[0_2px_0_0_rgba(63,67,71,0.25)] hover:brightness-97"
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
                    </button>
                )}
            </div>
        </div>
    );
}

/* ── Plain text ──────────────────────────────────────────────────────────── */
function PlainContent({ text }: { text: string }) {
    return (
        <p className="text-white/90 text-sm leading-[1.6] whitespace-pre-wrap break-words">
            {text}
        </p>
    );
}

/* ── Menu ────────────────────────────────────────────────────────────────── */
function MenuContent({
    menuItems,
    text,
    onItemClick,
}: {
    menuItems: MenuItem[];
    text: string;
    onItemClick?: (num: number) => void;
}) {
    const footerMatch = /Reply with.+/i.exec(text);
    const footer = footerMatch ? footerMatch[0] : null;
    const interactive = !!onItemClick;

    return (
        <div className="flex flex-col gap-2">
            {/* Label */}
            <div className="pb-1.5 border-b border-white/15">
                <span
                    className="text-[#ff9eb6] text-[10px] tracking-[1px] uppercase font-medium"
                    style={{ fontFamily: "var(--font-mono)" }}
                >
                    Menu
                </span>
            </div>

            <p className="text-white/80 text-xs">Here&apos;s our menu:</p>

            <div className="flex flex-col gap-1">
                {menuItems.map((item) => {
                    const inner = (
                        /* [num badge] [name ← 1fr →] [price] */
                        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 w-full">
                            <span
                                className="bg-white/15 rounded px-1.5 py-0.5 text-[#ff9eb6] text-xs font-bold leading-none tabular-nums"
                                style={{ fontFamily: "var(--font-mono)" }}
                            >
                                {item.number}
                            </span>
                            <span className="text-white/90 text-sm text-left truncate">{item.name}</span>
                            <span className="text-white/50 text-xs whitespace-nowrap text-right tabular-nums">
                                {item.price}
                            </span>
                        </div>
                    );

                    return interactive ? (
                        <button
                            key={item.number}
                            type="button"
                            onClick={() => onItemClick(item.number)}
                            className="key-btn bg-white/8 hover:bg-white/15 active:bg-white/20 rounded-[6px] px-2 py-2 text-left transition-colors w-full"
                            aria-label={`Order ${item.name}`}
                        >
                            {inner}
                        </button>
                    ) : (
                        <div key={item.number} className="bg-white/8 rounded-[6px] px-2 py-2">
                            {inner}
                        </div>
                    );
                })}
            </div>

            {footer && (
                <p className="text-white/40 text-xs pt-0.5 leading-4">{footer}</p>
            )}
        </div>
    );
}

/* ── Receipt ─────────────────────────────────────────────────────────────── */
function ReceiptContent({
    text,
    orderItems,
    orderTotal,
}: {
    text: string;
    orderItems: OrderItem[];
    orderTotal?: string;
}) {
    const [before, after] = text.split(/Current order:/i);
    const footer = after?.split(/Total:.*?(?:\n|$)/i)[1]?.trim();
    const header = before?.trim();

    return (
        <div className="flex flex-col gap-2">
            {header && (
                <p className="text-white/90 text-sm leading-[1.6] whitespace-pre-wrap">{header}</p>
            )}

            <p
                className="text-[#ff9eb6] text-xs font-semibold tracking-wide uppercase"
                style={{ fontFamily: "var(--font-mono)" }}
            >
                Current Order
            </p>

            {/* Receipt rows */}
            <div className="border border-white/12 rounded-[8px] overflow-hidden">
                {orderItems.map((item, i) => (
                    /* [qty] [name ← 1fr →] [price] — CSS grid, never wraps */
                    <div
                        key={i}
                        className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-2 border-b border-white/8 last:border-b-0"
                    >
                        <span
                            className="text-[#ff9eb6] text-xs font-bold shrink-0 tabular-nums"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            ×{item.qty}
                        </span>
                        <span className="text-white/90 text-sm truncate">{item.name}</span>
                        <span
                            className="text-white/50 text-xs whitespace-nowrap text-right tabular-nums"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            {item.price}
                        </span>
                    </div>
                ))}

                {orderTotal && (
                    <div className="grid grid-cols-[1fr_auto] items-center px-3 py-2 bg-white/6">
                        <span
                            className="text-[#ff9eb6]/70 text-[10px] tracking-widest uppercase"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            Total
                        </span>
                        <span
                            className="text-white font-semibold text-sm tabular-nums"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            {orderTotal}
                        </span>
                    </div>
                )}
            </div>

            {footer && (
                <p className="text-white/75 text-sm leading-[1.6] whitespace-pre-wrap">{footer}</p>
            )}
        </div>
    );
}
