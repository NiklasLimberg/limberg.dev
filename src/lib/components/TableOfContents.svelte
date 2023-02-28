<script lang="ts">
    import type { Metadata } from '$lib/types/metadata';

    export let toc: Metadata['toc'];
</script>

<nav>
    <div class="toc-heading">Table of Contents</div>
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
        width: 30ch;
    }

    .toc-heading {
        font-size: 1.2rem;
        font-weight: bold;
        margin-bottom: 6px;
    }

    ol {
        list-style: none;
        padding: 0;
    }

    ol li {
        margin-bottom: 6px;
    }
</style>
