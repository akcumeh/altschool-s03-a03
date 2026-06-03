"use client";

import type { MenuItem } from "@/types/chat";

interface KeypadProps {
    onSend: (value: string) => void;
    isOrdering: boolean;
    menuItems: MenuItem[] | null;
}

export default function Keypad({ onSend, isOrdering, menuItems }: KeypadProps) {
    const showMenuMode = isOrdering && menuItems && menuItems.length > 0;

    return (
        /* Almond Cream (#f5e3d3) distinguishes this zone from the Old Lace chat area */
        <div className="shrink-0 bg-[#f5e3d3] border-t border-[#3f4347]/15 px-4 pt-5 pb-6">
            {showMenuMode ? (
                <MenuModeKeypad menuItems={menuItems} onSend={onSend} isOrdering={isOrdering} />
            ) : (
                <DefaultKeypad onSend={onSend} isOrdering={isOrdering} />
            )}
        </div>
    );
}

/* ── Default: 5-button row ───────────────────────────────────────────────── */
function DefaultKeypad({
    onSend,
    isOrdering,
}: {
    onSend: (v: string) => void;
    isOrdering: boolean;
}) {
    return (
        <div className="grid grid-cols-5 gap-2.5">
            <KeyBtn label="1" onClick={() => onSend("1")}>
                <IconMenu />
            </KeyBtn>
            <KeyBtn label="99" onClick={() => onSend("99")}>
                <IconBag />
            </KeyBtn>
            <KeyBtn label="98" onClick={() => onSend("98")}>
                <IconReceipt />
            </KeyBtn>
            <KeyBtn label="97" onClick={() => onSend("97")}>
                <IconEye />
            </KeyBtn>
            <KeyBtn label="0" onClick={() => onSend("0")}>
                {isOrdering ? <IconCancel /> : <IconHome />}
            </KeyBtn>
        </div>
    );
}

/* ── Menu mode: n items + separator + utility row ────────────────────────── */
function MenuModeKeypad({
    menuItems,
    onSend,
    isOrdering,
}: {
    menuItems: MenuItem[];
    onSend: (v: string) => void;
    isOrdering: boolean;
}) {
    const cols = Math.min(menuItems.length, 6);

    return (
        <div className="flex flex-col gap-2.5">
            {/* Menu item buttons */}
            <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
                {menuItems.map((item) => (
                    <KeyBtn
                        key={item.number}
                        label={String(item.number)}
                        compact
                        onClick={() => onSend(String(item.number))}
                    >
                        <span
                            className="text-[#3f4347] text-sm font-bold leading-none"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            {item.number}
                        </span>
                    </KeyBtn>
                ))}
            </div>

            {/* Separator */}
            <div className="h-px bg-[#3f4347]/12" />

            {/* Utility row */}
            <div className="grid grid-cols-4 gap-2">
                <KeyBtn label="97" compact onClick={() => onSend("97")}>
                    <IconEye size="sm" />
                </KeyBtn>
                <KeyBtn label="98" compact onClick={() => onSend("98")}>
                    <IconReceipt size="sm" />
                </KeyBtn>
                <KeyBtn label="99" compact onClick={() => onSend("99")}>
                    <IconBag size="sm" />
                </KeyBtn>
                <KeyBtn label="0" compact onClick={() => onSend("0")}>
                    {isOrdering ? <IconCancel size="sm" /> : <IconHome size="sm" />}
                </KeyBtn>
            </div>
        </div>
    );
}

/* ── Button ──────────────────────────────────────────────────────────────── */
interface KeyBtnProps {
    label: string;
    onClick: () => void;
    children: React.ReactNode;
    compact?: boolean;
}

function KeyBtn({ label, onClick, children, compact = false }: KeyBtnProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "key-btn flex flex-col items-center justify-center gap-1 w-full",
                compact ? "h-[52px] rounded-[8px]" : "h-[68px] rounded-[10px]",
                "bg-[#fff6e8] border border-[#3f4347]/20",
                "shadow-[0_2px_0_0_rgba(63,67,71,0.18)]",
                "hover:bg-white/80",
            ].join(" ")}
            aria-label={`Send ${label}`}
        >
            <span className="shrink-0 opacity-70">{children}</span>
            <span
                className={`text-[#3f4347] font-semibold leading-none ${compact ? "text-sm" : "text-base"}`}
                style={{ fontFamily: "var(--font-mono)" }}
            >
                {label}
            </span>
        </button>
    );
}

/* ── Icons ───────────────────────────────────────────────────────────────── */
type IconSize = "sm" | "md";
interface IconProps { size?: IconSize; }

function IconMenu({ size = "md" }: IconProps) {
    const s = size === "sm" ? 15 : 18;
    return (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M7 4v3a3 3 0 0 0 3 3 3 3 0 0 0 3-3V4" stroke="#3f4347" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M10 10v7M7 17h6" stroke="#3f4347" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function IconBag({ size = "md" }: IconProps) {
    const s = size === "sm" ? 15 : 18;
    return (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <rect x="3" y="7" width="14" height="10" rx="2" stroke="#3f4347" strokeWidth="1.5" />
            <path d="M7 7V5a3 3 0 0 1 6 0v2" stroke="#3f4347" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function IconReceipt({ size = "md" }: IconProps) {
    const s = size === "sm" ? 15 : 18;
    return (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M4 3v14l2-1.5 2 1.5 2-1.5 2 1.5 2-1.5 2 1.5V3H4Z" stroke="#3f4347" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M7 8h6M7 11h4" stroke="#3f4347" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

function IconEye({ size = "md" }: IconProps) {
    const s = size === "sm" ? 15 : 18;
    return (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6Z" stroke="#3f4347" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="2.5" stroke="#3f4347" strokeWidth="1.5" />
        </svg>
    );
}

function IconHome({ size = "md" }: IconProps) {
    const s = size === "sm" ? 15 : 18;
    return (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 9.5 10 3l7 6.5V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z" stroke="#3f4347" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M7 18v-5h6v5" stroke="#3f4347" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

function IconCancel({ size = "md" }: IconProps) {
    const s = size === "sm" ? 15 : 18;
    return (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="7.5" stroke="#3f4347" strokeWidth="1.5" />
            <path d="m7 7 6 6M13 7l-6 6" stroke="#3f4347" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}
