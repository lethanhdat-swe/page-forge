import {
    FooterMinimal,
    FooterMinimalData,
    FooterMinimalSettings,
} from "./layouts/FooterMinimal";

export type FooterBlockProps = {
    settings: FooterMinimalSettings;
    data: FooterMinimalData;
};

export function FooterBlock(props: FooterBlockProps) {
    switch (props.settings.layout) {
        case "minimal": {
            const { settings, data } = props;
            return <FooterMinimal settings={settings} data={data} />;
        }
        default:
            return null;
    }
}
