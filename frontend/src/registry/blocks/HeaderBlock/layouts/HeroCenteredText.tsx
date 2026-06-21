export interface HeroCenteredTextData {
    title: string;
    subtitle: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    videoBgUrl?: string; // Khác biệt hoàn toàn với layout trên
}

export interface HeroCenteredTextSettings {
    layout: "centered-text";
    paddingY: string;
}

export function HeroCenteredText({
    data,
    settings,
}: {
    data: HeroCenteredTextData;
    settings: HeroCenteredTextSettings;
}) {
    return (
        <section
            className={`${settings.paddingY} bg-[var(--background-color)] text-center relative overflow-hidden`}
        >
            <div className="max-w-3xl mx-auto px-4 relative z-10 space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold text-[var(--text-color)]">
                    {data.title}
                </h1>
                <p className="text-gray-600 max-w-xl mx-auto">
                    {data.subtitle}
                </p>
                <div className="flex justify-center gap-4">
                    <a
                        href={data.primaryCtaLink}
                        className="bg-[var(--primary-color)] text-white px-6 py-3"
                    >
                        {data.primaryCtaText}
                    </a>
                    <a
                        href={data.secondaryCtaLink}
                        className="border border-gray-300 px-6 py-3 text-[var(--text-color)]"
                    >
                        {data.secondaryCtaText}
                    </a>
                </div>
            </div>
        </section>
    );
}
