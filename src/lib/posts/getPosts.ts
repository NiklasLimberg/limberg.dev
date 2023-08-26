export type Post = {
    path: string,
    metadata: {
        title: string,
        description: string,
        updated: string,
        date: string
    }
};

export async function getPosts() {
    const postImports = Object.entries(import.meta.glob('/posts/*.md'));
    const posts = [];

    for await (const [path, importPost] of postImports) {
        const post = await importPost() as Omit<Post, 'path'>;

        posts.push({
            path: path.replace('/posts/', '/blog/').replace('.md', ''),
            ...post.metadata,
        });
    }

    return posts.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}