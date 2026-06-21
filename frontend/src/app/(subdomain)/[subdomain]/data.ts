export const mockData = {
    siteId: "agency-website-simple",
    theme: {
        primaryColor: "#0070f3",
        backgroundColor: "#ffffff",
        textColor: "#111111",
    },
    globals: {
        header: {
            id: "header-01",
            type: "HeaderBlock",
            settings: { layout: "logo-left", sticky: true },
            data: {
                logo: "PageForge",
                links: [
                    { label: "Trang chủ", url: "/" },
                    { label: "Dịch vụ", url: "/services" },
                ],
            },
        },
        footer: {
            id: "footer-01",
            type: "FooterBlock",
            settings: { layout: "minimal" },
            data: {
                copyright: "© 2026 PageForge. All rights reserved.",
            },
        },
    },
    pages: {
        "/": {
            title: "Trang chủ",
            blocks: [
                {
                    id: "hero",
                    type: "HeroBlock",
                    settings: {
                        layout: "split-image",
                        paddingY: "py-20",
                    },
                    data: {
                        title: "Giải Pháp Số Thế Hệ Mới",
                        subtitle:
                            "Bứt phá doanh thu và định vị thương hiệu dẫn đầu.",
                        ctaText: "Khám phá ngay",
                        ctaLink: "/services",
                        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80",
                    },
                },
            ],
        },
        "/services": {
            title: "Dịch vụ",
            blocks: [
                {
                    id: "services",
                    type: "ServiceBlock",
                    settings: { layout: "grid-3-columns" },
                    data: {
                        heading: "Dịch vụ chiến lược",
                        items: [
                            {
                                id: "1",
                                title: "Phát triển Thương hiệu",
                                description:
                                    "Định vị thương hiệu chuyên nghiệp.",
                            },
                            {
                                id: "2",
                                title: "Digital Marketing",
                                description:
                                    "Tối ưu chiến dịch quảng cáo đa kênh.",
                            },
                            {
                                id: "3",
                                title: "Phát triển ứng dụng",
                                description:
                                    "Tối ưu chiến dịch quảng cáo đa kênh.",
                            },
                        ],
                    },
                },
            ],
        },
    },
};
