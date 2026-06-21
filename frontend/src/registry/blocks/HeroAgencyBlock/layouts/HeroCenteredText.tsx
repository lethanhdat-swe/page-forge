export interface HeroCenteredTextData {
    title: string;
    subtitle: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    videoBgUrl?: string;
}

export interface HeroCenteredTextSettings {
    layout: "centered-text";
    paddingY?: string;
}

export function HeroCenteredText({
    data,
    settings,
}: {
    data: HeroCenteredTextData;
    settings: HeroCenteredTextSettings;
}) {
    const paddingY = settings.paddingY || "py-24";

    return (
        <section
            style={{ backgroundColor: "var(--background-color)" }}
            className={`${paddingY} relative overflow-hidden text-center transition-colors duration-300`}
        >
            {data.videoBgUrl && (
                <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
                    <video
                        src={data.videoBgUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div
                        style={{
                            background: "radial-gradient(circle, transparent 40%, var(--background-color) 80%)",
                        }}
                        className="absolute inset-0"
                    />
                </div>
            )}
            <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 flex flex-col items-center space-y-8">
                <h1
                    style={{ color: "var(--text-color)" }}
                    className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight transition-colors duration-300"
                >
                    {data.title}
                </h1>
                <p
                    style={{ color: "var(--text-color)" }}
                    className="text-lg md:text-xl opacity-80 max-w-2xl leading-relaxed"
                >
                    {data.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <a
                        href={data.primaryCtaLink}
                        style={{
                            backgroundColor: "var(--primary-color)",
                            color: "var(--background-color)",
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ease-out"
                    >
                        {data.primaryCtaText}
                    </a>
                    <a
                        href={data.secondaryCtaLink}
                        style={{
                            borderColor: "var(--text-color)",
                            color: "var(--text-color)",
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl border-2 hover:bg-gray-100/10 hover:scale-105 active:scale-95 transition-all duration-300 ease-out"
                    >
                        {data.secondaryCtaText}
                    </a>
                </div>
            </div>
        </section>
    );
}
