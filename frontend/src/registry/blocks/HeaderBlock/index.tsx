import {
    HeaderLogoLeft,
    HeaderLogoLeftData,
    HeaderLogoLeftSettings,
} from "./layouts/HeaderLogoLeft";

export type HeaderBlockProps = {
    settings: HeaderLogoLeftSettings;
    data: HeaderLogoLeftData;
};

export function HeaderBlock(props: HeaderBlockProps) {
    switch (props.settings.layout) {
        case "logo-left": {
            const { settings, data } = props;
            return <HeaderLogoLeft settings={settings} data={data} />;
        }
        default:
            return null;
    }
}
