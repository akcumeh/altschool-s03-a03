"use client";

import { useEffect, useRef, useState } from "react";
import ChatHeader from "@/components/ChatHeader";
import BotBubble from "@/components/BotBubble";
import UserBubble from "@/components/UserBubble";
import TypingIndicator from "@/components/TypingIndicator";
import Keypad from "@/components/Keypad";
import EmailInputBar from "@/components/EmailInputBar";
import PaymentModal from "@/components/PaymentModal";
import type { Message, ChatState, MenuItem } from "@/types/chat";
import {
    detectChatState,
    parseMenuItems,
    processIncomingMessage,
} from "@/lib/chatParsing";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const DEVICE_KEY = "kk_device_id";
const MESSAGES_KEY = "kk_messages";
const PENDING_KEY = "kk_pending_message";

const WELCOME: Message = {
    id: "welcome",
    role: "bot",
    text: "Welcome to Kay's Kitchen!\n\nReply with a number to get started.\n\n1 - Place an order\n99 - Checkout\n98 - Order history\n97 - Current order\n0 - Cancel order",
};

function getOrCreateDeviceId(): string {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
}

function formatTimestamp(date: Date): string {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [chatState, setChatState] = useState<ChatState>("idle");
    const [menuItems, setMenuItems] = useState<MenuItem[] | null>(null);
    const [paystackModalUrl, setPaystackModalUrl] = useState<string | null>(null);
    const [sessionStart] = useState(() => new Date());
    const bottomRef = useRef<HTMLDivElement>(null);

    /* ── Initialise from localStorage ── */
    useEffect(() => {
        const saved = localStorage.getItem(MESSAGES_KEY);
        let persisted: Message[] = saved ? (JSON.parse(saved) as Message[]) : [];

        const pending = localStorage.getItem(PENDING_KEY);
        if (pending) {
            localStorage.removeItem(PENDING_KEY);
            const pendingMsg = processIncomingMessage({
                id: crypto.randomUUID(),
                role: "bot",
                text: pending,
            });
            persisted = [...persisted, pendingMsg];
            localStorage.setItem(MESSAGES_KEY, JSON.stringify(persisted));
        }

        /* Re-process bot messages to populate parsed fields (handles old localStorage data) */
        const reprocessed = persisted.map((m) =>
            m.role === "bot" ? processIncomingMessage(m) : m,
        );
        const initial = reprocessed.length === 0 ? [WELCOME] : reprocessed;
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(initial));
        setMessages(initial);

        /* Restore state from last bot message */
        const lastBot = [...initial].reverse().find((m) => m.role === "bot");
        if (lastBot) {
            const state = detectChatState(lastBot.text);
            setChatState(state);
            const items = parseMenuItems(lastBot.text);
            if (items) setMenuItems(items);
        }
    }, []);

    /* ── Scroll to bottom on new messages ── */
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    /* ── Send a message value (number or email string) ── */
    async function handleSend(value: string) {
        const text = value.trim();
        if (!text || loading) return;

        const deviceId = getOrCreateDeviceId();
        const userMsg: Message = { id: crypto.randomUUID(), role: "user", text };
        const next = [...messages, userMsg];
        setMessages(next);
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(next));
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ deviceId, option: text }),
            });

            if (!res.ok) throw new Error(`HTTP ${String(res.status)}`);

            const data = (await res.json()) as { message: string };
            const raw: Message = { id: crypto.randomUUID(), role: "bot", text: data.message };
            const processed = processIncomingMessage(raw);

            const withReply = [...next, processed];
            setMessages(withReply);
            localStorage.setItem(MESSAGES_KEY, JSON.stringify(withReply));

            /* Update chat state */
            const newState = detectChatState(data.message);
            setChatState(newState);

            const parsedMenu = parseMenuItems(data.message);
            if (parsedMenu) {
                setMenuItems(parsedMenu);
            } else if (newState === "idle") {
                setMenuItems(null);
            }
        } catch {
            const errMsg: Message = {
                id: crypto.randomUUID(),
                role: "bot",
                text: "Something went wrong connecting to the server. Please try again.",
            };
            const withErr = [...next, errMsg];
            setMessages(withErr);
            localStorage.setItem(MESSAGES_KEY, JSON.stringify(withErr));
            setChatState("idle");
        } finally {
            setLoading(false);
        }
    }

    function handlePaystack(url: string) {
        setPaystackModalUrl(url);
    }

    return (
        <div className="relative flex flex-col h-full bg-[#fff6e8] overflow-hidden">
            <ChatHeader />

            {/* Message list */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-4 py-4 space-y-3">
                {/* Timestamp */}
                <div className="flex justify-center">
                    <span className="text-[rgba(64,68,71,0.55)] text-[13px] leading-5">
                        Today, {formatTimestamp(sessionStart)}
                    </span>
                </div>

                {messages.map((msg) =>
                    msg.role === "user" ? (
                        <UserBubble key={msg.id} text={msg.text} />
                    ) : (
                        <BotBubble
                            key={msg.id}
                            text={msg.text}
                            menuItems={msg.menuItems}
                            orderItems={msg.orderItems}
                            orderTotal={msg.orderTotal}
                            paystackUrl={msg.paystackUrl}
                            onPaystackClick={handlePaystack}
                            onMenuItemClick={(num) => void handleSend(String(num))}
                        />
                    ),
                )}

                {loading && <TypingIndicator />}
                <div ref={bottomRef} />
            </div>

            {/* Input area: email bar when awaiting email, keypad otherwise */}
            {chatState === "awaiting_email" ? (
                <EmailInputBar onSend={handleSend} disabled={loading} />
            ) : (
                <Keypad
                    onSend={handleSend}
                    isOrdering={chatState === "ordering"}
                    menuItems={menuItems}
                />
            )}

            {paystackModalUrl && (
                <PaymentModal
                    url={paystackModalUrl}
                    onClose={() => setPaystackModalUrl(null)}
                />
            )}
        </div>
    );
}
