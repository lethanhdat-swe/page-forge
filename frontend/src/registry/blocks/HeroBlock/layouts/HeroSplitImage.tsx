export interface HeroSplitImageData {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    image: string;
}

export interface HeroSplitImageSettings {
    layout: "split-image";
    paddingY?: string;
}

export function HeroSplitImage({
    data,
    settings,
}: {
    data: HeroSplitImageData;
    settings: HeroSplitImageSettings;
}) {
    const paddingY = settings.paddingY || "py-20";

    return (
        <section
            style={{ backgroundColor: "var(--background-color)" }}
            className={`${paddingY} relative overflow-hidden transition-colors duration-300`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="flex flex-col space-y-6 max-w-xl">
                    <h1
                        style={{ color: "var(--text-color)" }}
                        className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight transition-colors duration-300"
                    >
                        {data.title}
                    </h1>
                    <p
                        className="text-lg md:text-xl opacity-80 leading-relaxed"
                        style={{ color: "var(--text-color)" }}
                    >
                        {data.subtitle}
                    </p>
                    <div>
                        <a
                            href={data.ctaLink}
                            style={{
                                backgroundColor: "var(--primary-color)",
                                color: "var(--background-color)",
                            }}
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ease-out"
                        >
                            {data.ctaText}
                        </a>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-[var(--primary-color)] to-transparent opacity-20 blur-xl"></div>
                    <img
                        src={data.image}
                        alt={data.title}
                        className="relative w-full h-auto object-cover rounded-3xl shadow-2xl hover:scale-[1.02] transition-transform duration-500 ease-out border border-black/5 dark:border-white/10"
                    />
                </div>
            </div>
        </section>
    );
}
