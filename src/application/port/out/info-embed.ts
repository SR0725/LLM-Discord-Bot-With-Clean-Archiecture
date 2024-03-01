export interface InfoEmbed {
    color: number,
    title: string;
    description: string;
    author?: {
        name: string;
        iconURL: string;
    };
    fields?: Array<{
        name: string;
        value: string;
        inline?: boolean;
    }>
    footer?: {
        text: string;
        iconURL: string;
    };
}