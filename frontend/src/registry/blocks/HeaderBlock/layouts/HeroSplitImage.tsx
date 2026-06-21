export interface HeroSplitImageData {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    image: string;
}

export interface HeroSplitImageSettings {
    layout: "split-image";
    paddingY: string;
}

export function HeroSplitImage({
    data,
    settings,
}: {
    data: HeroSplitImageData;
    settings: HeroSplitImageSettings;
}) {
    return (
        <section
            className={`${settings.paddingY} bg-[var(--background-color)]`}
        >
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h1 className="text-4xl font-bold text-[var(--text-color)]">
                        {data.title}
                    </h1>
                    <p className="text-gray-600 mt-4">{data.subtitle}</p>
                    <a
                        href={data.ctaLink}
                        className="inline-block mt-6 bg-[var(--primary-color)] text-white px-6 py-3"
                    >
                        {data.ctaText}
                    </a>
                </div>
                <div>
                    <img
                        src={data.image}
                        alt="Hero representation"
                        className="w-full h-auto"
                    />
                </div>
            </div>
        </section>
    );
}
