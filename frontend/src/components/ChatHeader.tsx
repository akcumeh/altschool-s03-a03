import Image from "next/image";

export default function ChatHeader() {
    return (
        <header className="shrink-0 h-14 flex items-center px-4 bg-[#3f4347] border-b border-[#ff9eb6]/40 relative z-10">

            {/* Logo + CSS tooltip */}
            <div className="relative group shrink-0">
                <button
                    className="w-8 h-8 rounded-full bg-[#2b2e31] border border-white/15 flex items-center justify-center overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9eb6]"
                    aria-label="About this project"
                    type="button"
                >
                    <Image
                        src="/assets/apple-touch-icon.png"
                        alt="Kay's Kitchen"
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                        priority
                    />
                </button>

                {/* Tooltip — appears below logo on hover */}
                <div
                    className="pointer-events-none group-hover:pointer-events-auto absolute top-full left-0 mt-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-[#2b2e31] border border-white/10 rounded-lg px-3 py-2 shadow-xl whitespace-nowrap"
                    role="tooltip"
                >
                    <p className="text-white/80 text-[11px] leading-5">
                        Designed by{" "}
                        <a
                            href="https://angelumeh.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-[#aaa] border-b border-dashed border-transparent hover:border-[#ff9eb6] transition-colors"
                        >
                            Angel Umeh
                        </a>
                        {" "}· ALT-SOE-025-3527
                    </p>
                </div>
            </div>

            {/* Title */}
            <h1
                className="flex-1 text-center text-white/90 text-xl font-medium tracking-[-0.4px] select-none"
                style={{ fontFamily: "var(--font-mono)" }}
            >
                Kay&apos;s Kitchen
            </h1>

            {/* GitHub */}
            <a
                href="https://github.com/akcumeh/altschool-s03-a03"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View on GitHub"
                className="shrink-0 w-9 h-9 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors"
            >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
                </svg>
            </a>
        </header>
    );
}
