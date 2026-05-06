<script lang="ts">
    import type { PageData } from './$types';
    import PostOverview from '$lib/components/PostOverview.svelte';

    let { data }: { data: PageData } = $props();
</script>

<svelte:head>
    <title>limberg.dev DevBlog</title>
    <meta name="description" content="An overview of all my posts." />
</svelte:head>

<div class="wrapper">
    <header>
        <h1>Posts</h1>
        <p>All my posts on one page.</p>
    </header>

    <main>
        {#each data.posts as post (post.slug)}
            <PostOverview
                title={post.title}
                slug={post.slug}
                description={post.description}
                date={post.date}
            />
        {/each}
    </main>
    <footer>
        <p>© {new Date().getFullYear()} Niklas Limberg</p>
    </footer>
</div>

<style>
    .wrapper {
        margin: 32px auto 0  auto;
        width: min(65ch, 100%);
    }
</style>