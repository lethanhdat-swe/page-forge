import { HeaderBlock } from "./blocks/HeaderBlock";
import { HeroBlock } from "./blocks/HeroBlock";
import { ServiceBlock } from "./blocks/ServiceBlock";
import { FooterBlock } from "./blocks/FooterBlock";

export const blockRegistry = {
    HeaderBlock,
    HeroBlock,
    ServiceBlock,
    FooterBlock,
} as const;

export type BlockType = keyof typeof blockRegistry;

export * from "./blocks/HeaderBlock";
export * from "./blocks/HeroBlock";
export * from "./blocks/ServiceBlock";
export * from "./blocks/FooterBlock";
