<script lang="ts">
    import type { Metadata } from '$lib/types/metadata';

    export let toc: Metadata['toc'];
</script>

<nav>
    <h2>Table of Contents</h2>
    <ol>
        {#each toc as item}
            <li>
                <a href="#{item.slug}">{item.text}</a>
            </li>
        {/each}
    </ol>
</nav>

<style>
    nav {
        position: sticky;
        top: 100px;
        padding-left: 40px;
    }

    ol {
        list-style: none;
        padding: 0;
    }

    ol li {
        margin-bottom: 4px;
    }
</style>
