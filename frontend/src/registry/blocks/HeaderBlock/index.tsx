import {
    HeaderLogoLeft,
    HeaderData,
    HeaderLogoLeftSettings,
} from "./layouts/HeaderLogoLeft";
import {
    HeaderLogoCenter,
    HeaderLogoCenterSettings,
} from "./layouts/HeaderLogoCenter";

export type HeaderBlockProps =
    | { settings: HeaderLogoLeftSettings; data: HeaderData }
    | { settings: HeaderLogoCenterSettings; data: HeaderData };

export function HeaderBlock(props: HeaderBlockProps) {
    switch (props.settings.layout) {
        case "logo-left": {
            const { settings, data } = props;
            return <HeaderLogoLeft settings={settings} data={data} />;
        }
        case "logo-center": {
            const { settings, data } = props;
            return <HeaderLogoCenter settings={settings} data={data} />;
        }
        default:
            return null;
    }
}
