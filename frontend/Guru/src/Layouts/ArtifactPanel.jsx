
import { useState, useEffect } from "react";
import {
    X,
    Files,
    FileCode2,
    Copy,
    Check,
    Download,
    Code2,
    Eye,
    PanelLeftClose,
} from "lucide-react";

const ArtifactPanel = ({ files = [], onClose }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [copied, setCopied] = useState(false);
    const [view, setView] = useState("code");

    // Keep the selected file valid when new artifacts arrive.
    useEffect(() => {
        setActiveIndex(0);
        setCopied(false);
        setView("code");
    }, [files]);

    const safeFiles = Array.isArray(files) ? files : [];
    const activeFile = safeFiles[activeIndex] ?? safeFiles[0];

    const handleCopy = async () => {
        if (!activeFile) return;

        try {
            await navigator.clipboard.writeText(activeFile.content ?? "");
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (error) {
            console.error("Unable to copy code:", error);
        }
    };

    const handleDownload = () => {
        if (!activeFile) return;

        const blob = new Blob([activeFile.content ?? ""], {
            type: "text/plain;charset=utf-8",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = activeFile.name;
        link.click();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    // Build a simple preview from generated HTML, CSS and JS files.
    const buildPreview = () => {
        const htmlFile = safeFiles.find((file) =>
            file.name?.toLowerCase().endsWith(".html")
        );

        if (!htmlFile) {
            return "<!DOCTYPE html><html><body><h2>No HTML file found</h2></body></html>";
        }

        let html = htmlFile.content ?? "";

        const css = safeFiles
            .filter((file) => file.name?.toLowerCase().endsWith(".css"))
            .map((file) => file.content ?? "")
            .join("\n");

        const js = safeFiles
            .filter((file) => file.name?.toLowerCase().endsWith(".js"))
            .map((file) => file.content ?? "")
            .join("\n")
            .replace(/<\/script/gi, "<\\/script");

        // Remove local stylesheet references to avoid duplicate loading.
        html = html.replace(
            /<link\b[^>]*href=["'][^"']+\.css(?:\?[^"']*)?["'][^>]*>/gi,
            ""
        );

        // Remove local script references; scripts are added below.
        html = html.replace(
            /<script\b[^>]*src=["'][^"']+\.js(?:\?[^"']*)?["'][^>]*>\s*<\/script>/gi,
            ""
        );

        const styleTag = css ? `<style>${css}</style>` : "";
        const scriptTag = js ? `<script>${js}<\/script>` : "";

        if (/<\/head>/i.test(html)) {
            html = html.replace(/<\/head>/i, `${styleTag}</head>`);
        } else {
            html = `${styleTag}${html}`;
        }

        if (/<\/body>/i.test(html)) {
            html = html.replace(/<\/body>/i, `${scriptTag}</body>`);
        } else {
            html += scriptTag;
        }

        return html;
    };

    if (!activeFile) {
        return (
            <aside className="flex h-full min-h-0 flex-col items-center justify-center bg-[#11120D] p-6 text-center text-[#FFFBF4]">
                <Files size={30} className="mb-3 text-[#D8CFBC]/40" />
                <h2 className="text-sm font-medium">No artifacts yet</h2>
                <p className="mt-2 text-xs text-[#D8CFBC]/50">
                    Generate code to see your files here.
                </p>
            </aside>
        );
    }

    return (
        <aside className="flex h-full min-h-0 flex-col overflow-hidden border-l border-[#D8CFBC]/10 bg-[#11120D] text-[#FFFBF4]">

            {/* Top toolbar */}
            <header className="flex h-[62px] shrink-0 items-center justify-between gap-2 border-b border-[#D8CFBC]/10 bg-[#151610] px-3 sm:px-4">

                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        title="Close artifact panel"
                        aria-label="Close artifact panel"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#D8CFBC]/65 transition hover:bg-white/[0.07] hover:text-[#FFFBF4]"
                    >
                        <PanelLeftClose size={18} />
                    </button>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#D8CFBC]/10 bg-[#D8CFBC]/[0.07] text-[#D8CFBA]">
                        <Code2 size={18} />
                    </div>

                    <div className="min-w-0">
                        <h2 className="truncate text-sm font-semibold">
                            {activeFile.name}
                        </h2>
                        <p className="text-[11px] text-[#D8CFBC]/45">
                            {safeFiles.length} generated files
                        </p>
                    </div>
                </div>

                {/* Code / Preview selector */}
                <div className="flex shrink-0 items-center rounded-xl border border-[#D8CFBC]/10 bg-[#0D0E0A] p-1">
                    <button
                        type="button"
                        onClick={() => setView("code")}
                        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition sm:px-3 ${view === "code"
                                ? "bg-[#D8CFBC] text-[#11120D]"
                                : "text-[#D8CFBC]/55 hover:text-[#FFFBF4]"
                            }`}
                    >
                        <Code2 size={14} />
                        Code
                    </button>

                    <button
                        type="button"
                        onClick={() => setView("preview")}
                        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition sm:px-3 ${view === "preview"
                                ? "bg-[#D8CFBC] text-[#11120D]"
                                : "text-[#D8CFBC]/55 hover:text-[#FFFBF4]"
                            }`}
                    >
                        <Eye size={14} />
                        Preview
                    </button>
                </div>
            </header>

            {/* File tabs */}
            <nav className="flex shrink-0 overflow-x-auto border-b border-[#D8CFBC]/10 bg-[#151610] px-2 scrollbar-hide">
                {safeFiles?.map((file, index) => (
                    <button
                        key={`${file.name}-${index}`}
                        type="button"
                        onClick={() => {
                            setActiveIndex(index);
                            setCopied(false);
                        }}
                        className={`relative flex shrink-0 items-center gap-2 px-3 py-3 text-xs transition sm:px-4 ${activeIndex === index
                                ? "text-[#FFFBF4]"
                                : "text-[#D8CFBC]/50 hover:text-[#D8CFBC]/85"
                            }`}
                    >
                        <FileCode2
                            size={14}
                            className={
                                activeIndex === index
                                    ? "text-[#D8CFBA]"
                                    : "text-[#D8CFBC]/45"
                            }
                        />

                        {file?.name}

                        {activeIndex === index && (
                            <span className="absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-[#D8CFBA]" />
                        )}
                    </button>
                ))}
            </nav>

            {/* Active file toolbar */}
            <div className="flex h-11 shrink-0 items-center justify-between gap-3 border-b border-[#D8CFBC]/10 px-3 sm:px-4">
                <span className="truncate text-xs text-[#D8CFBC]/70">
                    {activeFile?.name}
                </span>

                <div className="flex shrink-0 items-center gap-1">
                    <button
                        type="button"
                        onClick={handleCopy}
                        title="Copy file content"
                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-[#D8CFBC]/65 transition hover:bg-white/[0.06] hover:text-[#FFFBF4]"
                    >
                        {copied ? (
                            <Check size={14} className="text-emerald-400" />
                        ) : (
                            <Copy size={14} />
                        )}
                        {copied ? "Copied" : "Copy"}
                    </button>

                    <button
                        type="button"
                        onClick={handleDownload}
                        title="Download active file"
                        aria-label="Download active file"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#D8CFBC]/65 transition hover:bg-white/[0.06] hover:text-[#FFFBF4]"
                    >
                        <Download size={15} />
                    </button>
                </div>
            </div>

            {/* Editor / Preview */}
            <div className="min-h-0 flex-1 overflow-auto overscroll-contain">
                {view === "code" ? (
                    <pre className="m-0 min-h-full bg-[#11120D] px-4 py-5 font-mono text-[13px] leading-7 text-[#E3DECF] selection:bg-[#D8CFBC]/20 sm:px-5">
                        <code className="whitespace-pre">
                            {activeFile.content ?? ""}
                        </code>
                    </pre>
                ) : (
                    <iframe
                        key={safeFiles.map((file) => file.name).join("|")}
                        title="Generated project preview"
                        sandbox="allow-scripts"
                        srcDoc={buildPreview()}
                        referrerPolicy="no-referrer"
                        className="h-full min-h-[320px] w-full border-0 bg-white"
                    />
                )}
            </div>

            {/* Status bar */}
            <footer className="flex h-7 shrink-0 items-center justify-between gap-3 border-t border-[#D8CFBC]/10 bg-[#151610] px-3 sm:px-4">
                <span className="flex min-w-0 items-center gap-2 truncate text-[10px] text-[#D8CFBC]/45">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                    Code Workspace
                </span>

                <span className="shrink-0 text-[10px] text-[#D8CFBC]/40">
                    {activeFile.name.split(".").pop()?.toUpperCase() || "TEXT"}
                </span>
            </footer>
        </aside>
    );
};

export default ArtifactPanel;
