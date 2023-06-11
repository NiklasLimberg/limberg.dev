<script lang="ts">
    import type { PageData } from './$types';
    import TableOfContents from '$lib/components/TableOfContents.svelte';
    import { onMount } from 'svelte';

    import 'prismjs/themes/prism.css';
    import '$lib/styles/code.css';

    export let data: PageData;

    const tableOfContents = data.metadata.toc;
    let currentHeadlineSlug = '';

    const sectionHeadlines: Element[] = [];

    function findCurrentHeadline() {
        let lastHeadlineBelowFold = sectionHeadlines[0];

        if(window.scrollY + window.innerHeight + 50 > document.body.scrollHeight) {
            currentHeadlineSlug = sectionHeadlines?.at(-1)?.id ?? '';
            return;
        }

        for(const headline of sectionHeadlines) {
            if (headline.getBoundingClientRect().top - 100 > 0) {
                break;
            }

            lastHeadlineBelowFold = headline;
        }

        currentHeadlineSlug = lastHeadlineBelowFold?.id;
    }


    onMount(() => {
        for(const headline of tableOfContents) {
            const headlineElement = document.getElementById(headline.slug);

            if(!headlineElement) {
                continue;
            }

            sectionHeadlines.push(headlineElement);
        }

        findCurrentHeadline();
        window.onscroll = findCurrentHeadline;
    });
</script>

<svelte:head>
    <title>{data.metadata.title}</title>
    <meta name="description" content={data.metadata.description} />
</svelte:head>

<div class="article-wrapper article">
    <aside class="toc">
        <TableOfContents tableOfContents={data.metadata.toc} currentHeadlineSlug={currentHeadlineSlug} />
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

    @media (max-width: 900px) {
        .toc {
            display: none;
        }
    }

    :global(.article h1:hover > a, .article h2:hover > a, .article h3:hover > a,
     .article h4:hover > a, .article h5:hover > a, .article h6:hover > a) {
        text-decoration: underline;
    }

    :global(.article h1:hover > a::after, .article h2:hover > a::after,
    .article h3:hover > a::after, .article h4:hover > a::after,
    .article h5:hover > a::after, .article h6:hover > a::after)   {
        content: '#';
        display: inline-block;
        text-decoration: none;
        padding: 0 8px;
    }
</style>