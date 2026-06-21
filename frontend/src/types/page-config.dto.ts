import { BlockType } from "@/registry";

export interface BlockConfig {
    id: string;
    type: BlockType;
    settings: Record<string, any>;
    data: Record<string, any>;
}

export interface PageConfig {
    siteId: string;
    theme: {
        primaryColor: string;
        backgroundColor: string;
        textColor: string;
    };
    globals: {
        header: BlockConfig;
        footer: BlockConfig;
    };
    pages: {
        [pathname: string]: {
            title: string;
            blocks: BlockConfig[];
        };
    };
}
