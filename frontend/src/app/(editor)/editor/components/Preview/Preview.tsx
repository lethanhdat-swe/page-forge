"use client";

interface PreviewProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    currentDevice?: "desktop" | "tablet" | "mobile";
}

export default function Preview({
    sidebarOpen,
    setSidebarOpen,
    currentDevice = "desktop",
}: PreviewProps) {
    const getResponsiveWidth = () => {
        switch (currentDevice) {
            case "mobile":
                return "w-[375px] h-[667px] max-h-full";
            case "tablet":
                return "w-[768px] h-[1024px] max-h-full";
            default:
                return "w-full h-full";
        }
    };

    return (
        <div className="flex-1 bg-muted/30 h-full flex items-center justify-center p-4 overflow-auto">
            {/* Khung wrapper bọc ngoài hỗ trợ căn giữa và bo góc điện thoại/máy tính bảng */}
            <div
                className={`${getResponsiveWidth()} bg-white shadow-xl rounded-md overflow-hidden transition-all duration-300`}
            >
                <iframe
                    src="/preview-render"
                    className="w-full h-full border-none"
                    title="PageForge Canvas Preview"
                />
            </div>
        </div>
    );
}
