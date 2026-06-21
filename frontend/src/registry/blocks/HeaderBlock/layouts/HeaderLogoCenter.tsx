"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export interface HeaderLink {
    label: string;
    url: string;
}

export interface HeaderData {
    logo: string;
    links: HeaderLink[];
}

export interface HeaderLogoCenterSettings {
    layout: "logo-center";
    sticky?: boolean;
}

export function HeaderLogoCenter({
    data,
    settings,
}: {
    data: HeaderData;
    settings: HeaderLogoCenterSettings;
}) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header
            style={{
                backgroundColor: settings.sticky ? "transparent" : "var(--background-color)",
                color: "var(--text-color)",
            }}
            className={`${
                settings.sticky
                    ? "sticky top-0 z-50 backdrop-blur-md bg-[var(--background-color)]/90 shadow-sm"
                    : "relative"
            } border-b border-black/5 transition-all duration-300`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col items-center justify-between md:gap-4">
                {/* Top Section - Centered Logo & Hamburger */}
                <div className="w-full flex items-center justify-between md:justify-center relative">
                    <a
                        href="/"
                        className="text-3xl font-extrabold tracking-tight hover:opacity-85 transition-opacity md:mx-auto"
                    >
                        {data.logo}
                    </a>

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none absolute right-0"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Bottom Section - Desktop Navigation Links */}
                <nav className="hidden md:flex items-center justify-center space-x-10 mt-3">
                    {data.links.map((link, idx) => (
                        <a
                            key={idx}
                            href={link.url}
                            className="font-semibold text-sm tracking-wide transition-colors duration-200 hover:text-[var(--primary-color)]"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileOpen && (
                <div
                    style={{ backgroundColor: "var(--background-color)" }}
                    className="md:hidden border-t border-black/5 transition-all duration-300"
                >
                    <nav className="flex flex-col px-6 py-4 space-y-4 text-center">
                        {data.links.map((link, idx) => (
                            <a
                                key={idx}
                                href={link.url}
                                onClick={() => setMobileOpen(false)}
                                className="font-medium text-base transition-colors duration-200 hover:text-[var(--primary-color)]"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
