<script lang="ts">
    import type { PageData } from './$types';
    import { metadata_store } from '$lib/store/metadata';
    import TableOfContents from '$lib/components/TableOfContents.svelte';

    import 'prismjs/themes/prism.css';
    import '$lib/styles/code.css';

    export let data: PageData;
    
    metadata_store.set(data.metadata);
</script>

<svelte:head>
    <title>{data.metadata.title}</title>
    <meta name="description" content={data.metadata.description} />
</svelte:head>

<div class="article-wrapper">
    <aside class="toc">
        <TableOfContents toc={data.metadata.toc} />
    </aside>
    <main class="restrict-width">
        <a class="back-link" href="/blog">← Back to blog</a>
        <svelte:component this={data.content} />
    </main>
</div>

<style>
    .article-wrapper {
        display: flex;
        flex-direction: row-reverse;
        justify-content: center;
        gap: 32px
    }

    .back-link {
        margin-bottom: 8px;
    }

    @media (max-width: 600px) {
        .toc {
            display: none;
        }
    }
</style>