import { mockData } from "@/app/(subdomain)/[subdomain]/data";
import { RenderEngine } from "@/engines/RenderEngine";
import { PageConfig } from "@/types/page-config.dto";
import { notFound } from "next/navigation";

interface SubdomainPageProps {
    params: Promise<{
        subdomain: string;
        pathname?: string[];
    }>;
}

export default async function SubdomainPage({ params }: SubdomainPageProps) {
    const { subdomain, pathname } = await params;

    const currentPath = pathname ? `/${pathname.join("/")}` : "/";

    const config = mockData as PageConfig;
    if (!config) return notFound();

    const pageData = config.pages[currentPath];
    if (!pageData) return notFound();

    const themeStyles = `
        :root {
            --primary-color: ${config.theme.primaryColor};
            --background-color: ${config.theme.backgroundColor};
            --text-color: ${config.theme.textColor};
        }
    `;

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: themeStyles }} />

            <div
                style={{
                    backgroundColor: "var(--background-color)",
                    color: "var(--text-color)",
                }}
            >
                <RenderEngine blocks={[config.globals.header]} />

                <main>
                    <RenderEngine blocks={pageData.blocks} />
                </main>

                <RenderEngine blocks={[config.globals.footer]} />
            </div>
        </>
    );
}
