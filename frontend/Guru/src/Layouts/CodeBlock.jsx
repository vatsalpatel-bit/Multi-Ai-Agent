import { useState } from "react";
import { Copy, Check } from "lucide-react";

const CodeBlock = ({ children, className }) => {
    const [copied, setCopied] = useState(false);

    const code = String(children).replace(/\n$/, "");

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to copy code:", error);
        }
    };

    const language = className
        ?.replace("language-", "") || "Code";

    return (
        <div className="my-4 overflow-hidden rounded-xl border border-white/10 bg-[#171717]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
                <span className="text-xs text-gray-400">
                    {language}
                </span>

                <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-2 rounded-md px-2 py-1 text-xs text-gray-300 transition hover:bg-white/10 hover:text-white"
                    aria-label="Copy code"
                >
                    {copied ? (
                        <Check size={14} />
                    ) : (
                        <Copy size={14} />
                    )}

                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>

            <pre className="overflow-x-auto p-4 text-sm leading-6 text-gray-100">
                <code className={className}>{code}</code>
            </pre>
        </div>
    );
};

export default CodeBlock;