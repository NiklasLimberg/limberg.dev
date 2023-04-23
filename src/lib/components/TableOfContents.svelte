<script lang="ts">
    import type { Metadata } from '$lib/types/metadata';

    export let tableOfContents: Metadata['toc'];
    export let currentHeadlineSlug: string;
</script>

<nav>
    <div class="toc-heading">Table of Contents</div>
    <ol>
        {#each tableOfContents as item}
            <li class:current={currentHeadlineSlug === item.slug}>
                <a href="#{item.slug}" aria-current="{currentHeadlineSlug === item.slug}">{item.text}</a>
            </li>
        {/each}
    </ol>
</nav>

<style scoped>
    nav {
        position: sticky;
        top: 100px;
        padding-left: 40px;
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

    li {
        border-left:  2px solid #f8f6f6;
        width: 30ch;
    }
    
    li.current {
        border-left-color: #07a;
        background-color: #f8f6f6;
    }
    li a {
        padding: 6px;
        display: block;
        color: #666;
        text-decoration: none;
    }

    li.current a {
        font-weight: bold;
    }
</style>
