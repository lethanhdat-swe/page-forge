import {
    ServicesGrid3Columns,
    ServicesGrid3ColumnsData,
    ServicesGrid3ColumnsSettings,
} from "./layouts/ServicesGrid3Columns";

export type ServicesGridBlockProps = {
    settings: ServicesGrid3ColumnsSettings;
    data: ServicesGrid3ColumnsData;
};

export function ServicesGridBlock(props: ServicesGridBlockProps) {
    switch (props.settings.layout) {
        case "grid-3-columns": {
            const { settings, data } = props;
            return <ServicesGrid3Columns settings={settings} data={data} />;
        }
        default:
            return null;
    }
}
