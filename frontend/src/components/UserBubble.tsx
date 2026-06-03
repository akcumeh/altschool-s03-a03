interface UserBubbleProps {
    text: string;
}

export default function UserBubble({ text }: UserBubbleProps) {
    return (
        <div className="flex justify-end">
            <div className="max-w-[82%] bg-[#f5e3d3] border border-[#ff9eb6]/60 rounded-[14px] rounded-tr-[4px] px-4 py-2.5">
                <p className="text-[#3f4347] text-sm leading-[1.6] whitespace-pre-wrap break-words">
                    {text}
                </p>
            </div>
        </div>
    );
}
