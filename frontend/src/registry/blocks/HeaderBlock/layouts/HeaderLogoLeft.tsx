"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export interface HeaderLink {
    label: string;
    url: string;
}

export interface HeaderLogoLeftData {
    logo: string;
    links: HeaderLink[];
}

export interface HeaderLogoLeftSettings {
    layout: "logo-left";
    sticky?: boolean;
}

export function HeaderLogoLeft({
    data,
    settings,
}: {
    data: HeaderLogoLeftData;
    settings: HeaderLogoLeftSettings;
}) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header
            style={{
                backgroundColor: settings.sticky
                    ? "transparent"
                    : "var(--background-color)",
                color: "var(--text-color)",
            }}
            className={`${
                settings.sticky
                    ? "sticky top-0 z-50 backdrop-blur-md bg-[var(--background-color)]/90 shadow-sm"
                    : "relative"
            } border-b border-black/5 transition-all duration-300`}
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <a
                    href="/"
                    className="text-2xl font-bold tracking-tight hover:opacity-85 transition-opacity"
                >
                    {data.logo}
                </a>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {data.links.map((link, idx) => (
                        <a
                            key={idx}
                            href={link.url}
                            className="font-medium text-sm transition-colors duration-200 hover:text-[var(--primary-color)]"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Mobile Hamburger Button */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileOpen && (
                <div
                    style={{ backgroundColor: "var(--background-color)" }}
                    className="md:hidden border-t border-black/5 transition-all duration-300"
                >
                    <nav className="flex flex-col px-6 py-4 space-y-4">
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
