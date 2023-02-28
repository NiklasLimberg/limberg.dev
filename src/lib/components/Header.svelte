<script lang="ts">
    import type { Metadata  } from '$lib/types/metadata';
    import { formatDate } from '$lib/formater/date';
    
    export let metadata: Metadata;
</script>

<header>
    <h1>{metadata.title}</h1>
    <div class="publishedDate">Published {formatDate(metadata.date)}</div>
    <details class="inline-toc">
        <summary>Table of contents</summary>
        <div class="toc-list">
            <ol>
                {#each metadata.toc as item}
                    <li>
                        <a href="#{item.slug}">{item.text}</a>
                    </li>
                {/each}
            </ol>
        </div>
    </details>

    <slot />
</header>

<style>
    @media (min-width: 900px) {
        .inline-toc {
            display: none;
        }
    }

    h1 {
        margin: 0 0 4px 0;
    }

    .publishedDate {
        font-size: 0.8em;
        color: #666;
        margin-bottom: 16px;
    }

    details {
        margin-bottom: 16px;
    }

    summary {
        list-style: none;
    }
    
    .toc-list {
        margin-top: 8px;
    }
    
    details summary::after {
        display: inline-block;
        vertical-align: text-top;
        margin-left: 16px;
        font-size: 12px;
        content: '▼';
    }
    
    details[open] summary::after {
        content: '▲';
    }

    ol {
        list-style: none;
        padding: 0;
    }

    ol li {
        margin-bottom: 4px;
    }
</style>