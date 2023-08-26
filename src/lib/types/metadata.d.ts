export interface Metadata {
    title: string;
    description: string;
    date: string;
    tags: string[];
    image?: string;
    toc: {text: string, slug: string}[];
}