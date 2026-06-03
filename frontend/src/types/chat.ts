export interface MenuItem {
    number: number;
    name: string;
    price: string;
}

export interface OrderItem {
    name: string;
    qty: number;
    price: string;
}

export interface Message {
    id: string;
    role: "user" | "bot";
    text: string;
    paystackUrl?: string;
    menuItems?: MenuItem[];
    orderItems?: OrderItem[];
    orderTotal?: string;
    isEmailPrompt?: boolean;
}

export type ChatState = "idle" | "ordering" | "awaiting_email";
