export interface ServiceItem {
    id: string;
    title: string;
    description: string;
}

export interface ServicesGrid3ColumnsData {
    heading: string;
    items: ServiceItem[];
}

export interface ServicesGrid3ColumnsSettings {
    layout: "grid-3-columns";
}

export function ServicesGrid3Columns({
    data,
    settings,
}: {
    data: ServicesGrid3ColumnsData;
    settings: ServicesGrid3ColumnsSettings;
}) {
    return (
        <section
            style={{ backgroundColor: "var(--background-color)" }}
            className="py-24 transition-colors duration-300"
        >
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Section Heading */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2
                        style={{ color: "var(--text-color)" }}
                        className="text-3xl md:text-4xl font-extrabold tracking-tight transition-colors duration-300"
                    >
                        {data.heading}
                    </h2>
                    <div
                        style={{ backgroundColor: "var(--primary-color)" }}
                        className="h-1 w-12 mx-auto mt-4 rounded-full"
                    />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.items.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                color: "var(--text-color)",
                            }}
                            className="group relative bg-white dark:bg-black/20 p-8 rounded-2xl border border-black/5 hover:border-[var(--primary-color)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-out"
                        >
                            <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--primary-color)] transition-colors duration-300">
                                {item.title}
                            </h3>
                            <p className="opacity-80 leading-relaxed text-sm">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
