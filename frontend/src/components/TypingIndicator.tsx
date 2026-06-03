import Image from "next/image";

export default function TypingIndicator() {
    return (
        <div className="flex gap-2.5 items-end">
            <div className="shrink-0 w-7 h-7 rounded-full bg-[#3f4347] border border-[#ff9eb6]/40 overflow-hidden flex items-center justify-center">
                <Image
                    src="/assets/apple-touch-icon.png"
                    alt=""
                    width={28}
                    height={28}
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="bg-[#3f4347] rounded-[14px] rounded-bl-[4px] px-4 py-3">
                <div className="flex gap-1.5 items-center">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className="typing-dot w-1.5 h-1.5 bg-[#ff9eb6] rounded-full"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
