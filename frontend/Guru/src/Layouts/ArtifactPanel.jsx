
import { useState } from "react";
import {
    X,
    Files,
    FileCode2,
    Copy,
    Check,
    Download,
} from "lucide-react";

const ArtifactPanel = ({
    files = [],
    onClose,
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [copied, setCopied] = useState(false);

    if (!files.length) return null;

    const activeFile = files[activeIndex];

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(activeFile.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (error) {
            console.error("Unable to copy code:", error);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([activeFile.content], {
            type: "text/plain;charset=utf-8",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = activeFile.name;
        link.click();

        URL.revokeObjectURL(url);
    };

    return (

        <aside className="flex h-full min-h-0 flex-col overflow-hidden border-l border-[#D8CFBC]/10 bg-[#14150F] text-[#F1EEE4]">

            {/* Header */}
            <header className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#D8CFBC]/15 bg-[#D8CFBC]/[0.07]">
                        <Files size={18} className="text-[#D8CFBA]" />
                    </div>

                    <div className="min-w-0">
                        <h2 className="text-sm font-semibold tracking-wide text-[#FFFBF4]">
                            Artifact
                        </h2>
                        <p className="mt-0.5 text-xs text-[#D8CFBC]/50">
                            {files.length} {files.length === 1 ? "file" : "files"} generated
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close artifact panel"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#D8CFBC]/60 transition hover:bg-white/[0.07] hover:text-[#FFFBF4]"
                >
                    <X size={17} />
                </button>
            </header>

            {/* File navigation */}
            <div className="shrink-0 border-b border-white/[0.07] bg-[#11120D]/60">
                <div className="flex items-center gap-1 overflow-x-auto px-3 pt-2 scrollbar-hide">
                    {files?.map((file, index) => (
                        <button
                            key={`${file.name}-${index}`}
                            type="button"
                            onClick={() => {
                                setActiveIndex(index);
                                setCopied(false);
                            }}
                            className={`relative flex max-w-[200px] shrink-0 items-center gap-2 rounded-t-lg px-3 py-3 text-xs transition ${activeIndex === index
                                    ? "bg-[#D8CFBC]/[0.07] text-[#FFFBF4]"
                                    : "text-[#D8CFBC]/50 hover:bg-white/[0.035] hover:text-[#D8CFBC]/90"
                                }`}
                        >
                            <FileCode2
                                size={15}
                                className={
                                    activeIndex === index
                                        ? "shrink-0 text-[#D8CFBA]"
                                        : "shrink-0 text-[#D8CFBC]/45"
                                }
                            />
                            <span className="truncate">{file.name}</span>

                            {activeIndex === index && (
                                <span className="absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-[#D8CFBA]" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Editor toolbar */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3">
                <div className="flex min-w-0 items-center gap-2">
                    <FileCode2 size={15} className="shrink-0 text-[#D8CFBA]/70" />
                    <span className="truncate text-xs font-medium text-[#E7E1D3]">
                        {activeFile.name}
                    </span>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-2 text-xs text-[#D8CFBC]/65 transition hover:border-white/[0.08] hover:bg-white/[0.05] hover:text-[#FFFBF4]"
                    >
                        {copied ? (
                            <Check size={14} className="text-emerald-400" />
                        ) : (
                            <Copy size={14} />
                        )}
                        <span>{copied ? "Copied" : "Copy"}</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleDownload}
                        aria-label="Download current file"
                        title="Download file"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#D8CFBC]/65 transition hover:bg-white/[0.06] hover:text-[#FFFBF4]"
                    >
                        <Download size={15} />
                    </button>
                </div>
            </div>

            {/* Code editor */}
            <div className="min-h-0 flex-1 overflow-auto overscroll-contain">
                <pre className="m-0 min-h-full bg-transparent px-5 py-5 font-mono text-[13px] leading-[1.9] text-[#D8D6CC] selection:bg-[#D8CFBA]/20">
                    <code className="whitespace-pre">{activeFile.content}</code>
                </pre>
            </div>

            {/* Status bar */}
            <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-white/[0.07] bg-[#11120D]/70 px-4 py-2">
                <div className="flex min-w-0 items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    <span className="truncate text-[10px] text-[#D8CFBC]/45">
                        Generated successfully
                    </span>
                </div>

                <span className="shrink-0 text-[10px] text-[#D8CFBC]/35">
                    {activeFile.name.split(".").pop()?.toUpperCase() || "TEXT"}
                </span>
            </footer>
        </aside>

    );
}

export default ArtifactPanel;
