import { ComponentType } from "react";
import { blockRegistry } from "@/registry";
import { BlockConfig } from "@/types/page-config.dto";

interface RenderEngineProps {
    blocks: BlockConfig[];
}

export function RenderEngine({ blocks }: RenderEngineProps) {
    if (!blocks || blocks.length === 0) return null;

    return (
        <>
            {blocks.map((block) => {
                const Component = blockRegistry[block.type] as ComponentType<{
                    settings: BlockConfig["settings"];
                    data: BlockConfig["data"];
                }>;

                if (!Component) {
                    console.warn(
                        `[RenderEngine] Block type "${block.type}" is not registered.`,
                    );
                    return null;
                }

                return (
                    <Component
                        key={block.id}
                        settings={block.settings}
                        data={block.data}
                    />
                );
            })}
        </>
    );
}
