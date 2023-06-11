import { getPosts } from '$lib/posts/getPosts';

const xmlPreamble =
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
const xmlPostamble = '</urlset>';

function generateSitemap(paths: string[]) {
    const siteMapEntries = paths.reduce((acc, path) => {
        return acc + `<url><loc>https://limberg.dev${path}</loc></url>`;
    }, xmlPreamble);

    return siteMapEntries.concat(xmlPostamble);
}

export async function GET() {
    const pages = ['/', '/blog'];
    const posts = await getPosts();

    const paths = pages.concat(posts.map((post) => post.path));

    const headers = {
        'Cache-Control': 'max-age=0, s-maxage=3600',
        'Content-Type': 'application/xml',
    };

    return new Response(generateSitemap(paths), {
        headers,
    });
}
