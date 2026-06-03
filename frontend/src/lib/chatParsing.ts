import type { MenuItem, OrderItem, Message, ChatState } from "@/types/chat";

export function parseMenuItems(text: string): MenuItem[] | null {
    if (!text.includes("Here's our menu:")) return null;
    const lines = text.split("\n");
    const items: MenuItem[] = [];
    for (const line of lines) {
        const match = /^(\d+)\.\s+(.+?)\s+-\s+(NGN\s+[\d,]+)/.exec(line.trim());
        if (match) {
            items.push({
                number: parseInt(match[1], 10),
                name: match[2].trim(),
                price: match[3].trim(),
            });
        }
    }
    return items.length > 0 ? items : null;
}

export function parseOrderItems(text: string): { items: OrderItem[]; total: string } | null {
    if (!text.includes("Current order:")) return null;
    const lines = text.split("\n");
    const items: OrderItem[] = [];
    let total = "";
    for (const line of lines) {
        const itemMatch = /^-\s+(.+?)\s+x(\d+)\s+\((.+?)\)/.exec(line.trim());
        if (itemMatch) {
            items.push({
                name: itemMatch[1].trim(),
                qty: parseInt(itemMatch[2], 10),
                price: itemMatch[3].trim(),
            });
        }
        const totalMatch = /^Total:\s+(.+)/.exec(line.trim());
        if (totalMatch) {
            total = totalMatch[1].trim();
        }
    }
    return items.length > 0 ? { items, total } : null;
}

export function extractPaystackUrl(text: string): string | null {
    const match = /https:\/\/checkout\.paystack\.com\/[a-zA-Z0-9]+/.exec(text);
    return match ? match[0] : null;
}

export function detectChatState(text: string): ChatState {
    const lower = text.toLowerCase();
    if (
        lower.includes("reply with your email address") ||
        lower.includes("please reply with your email")
    ) {
        return "awaiting_email";
    }
    if (
        lower.includes("here's our menu:") ||
        (lower.includes("added") && lower.includes("to your order")) ||
        lower.includes("send another number to add more")
    ) {
        return "ordering";
    }
    return "idle";
}

export function processIncomingMessage(raw: Message): Message {
    if (raw.role !== "bot") return raw;

    const paystackUrl = extractPaystackUrl(raw.text);
    const menuItems = parseMenuItems(raw.text);
    const orderData = parseOrderItems(raw.text);
    const isEmailPrompt =
        raw.text.toLowerCase().includes("reply with your email address") ||
        raw.text.toLowerCase().includes("please reply with your email");

    let cleanText = raw.text;
    if (paystackUrl) {
        cleanText = raw.text
            .replace(/Complete your payment here:\s*/i, "")
            .replace(paystackUrl, "")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
        if (!cleanText || cleanText === "Order placed!") {
            cleanText = "Order placed! Complete your payment below.";
        }
    }

    return {
        ...raw,
        text: cleanText,
        paystackUrl: paystackUrl ?? undefined,
        menuItems: menuItems ?? undefined,
        orderItems: orderData?.items,
        orderTotal: orderData?.total,
        isEmailPrompt,
    };
}
