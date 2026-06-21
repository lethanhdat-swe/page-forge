export interface FooterMinimalData {
    copyright: string;
}

export interface FooterMinimalSettings {
    layout: "minimal";
}

export function FooterMinimal({
    data,
    settings,
}: {
    data: FooterMinimalData;
    settings: FooterMinimalSettings;
}) {
    return (
        <footer
            style={{
                backgroundColor: "var(--background-color)",
                color: "var(--text-color)",
            }}
            className="py-12 border-t border-black/5 dark:border-white/5 transition-colors duration-300"
        >
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-sm opacity-60 font-medium">
                    {data.copyright}
                </p>
            </div>
        </footer>
    );
}
