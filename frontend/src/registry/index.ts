import { HeaderBlock } from "./blocks/HeaderBlock";
import { HeroAgencyBlock } from "./blocks/HeroAgencyBlock";
import { ServicesGridBlock } from "./blocks/ServicesGridBlock";
import { FooterBlock } from "./blocks/FooterBlock";

export const blockRegistry = {
    HeaderBlock,
    HeroAgencyBlock,
    ServicesGridBlock,
    FooterBlock,
} as const;

export type BlockType = keyof typeof blockRegistry;

export * from "./blocks/HeaderBlock";
export * from "./blocks/HeroAgencyBlock";
export * from "./blocks/ServicesGridBlock";
export * from "./blocks/FooterBlock";
