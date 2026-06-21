import {
    HeroSplitImage,
    HeroSplitImageData,
    HeroSplitImageSettings,
} from "./layouts/HeroSplitImage";
import {
    HeroCenteredText,
    HeroCenteredTextData,
    HeroCenteredTextSettings,
} from "./layouts/HeroCenteredText";

export type HeroAgencyBlockProps =
    | { settings: HeroSplitImageSettings; data: HeroSplitImageData }
    | { settings: HeroCenteredTextSettings; data: HeroCenteredTextData };

export function HeroAgencyBlock(props: HeroAgencyBlockProps) {
    switch (props.settings.layout) {
        case "split-image": {
            const { settings, data } = props;
            return <HeroSplitImage settings={settings} data={data} />;
        }
        case "centered-text": {
            const { settings, data } = props;
            return <HeroCenteredText settings={settings} data={data} />;
        }
        default:
            return null;
    }
}
