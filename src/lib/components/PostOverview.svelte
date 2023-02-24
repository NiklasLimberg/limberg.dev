<script lang="ts">
    import { formatDate } from '$lib/formater/date';

    export let title: string;
    export let path: string;
    export let description: string;
    export let date: string;
</script>

<article>
    <h2>
        <a href={path} title="{title}">
            {title}
        </a>
    </h2>
    <div class="description">
        {description}
    </div>
    <div>
        Published {formatDate(date)}
    </div>
</article>

<style>
    article {
        background-color: #f5f5f5;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 16px;
        margin: 16px 0;
    }
    
    article h2 {
        margin: 0 0 16px 0;
    }
    
    .description {
        margin-bottom: 16px;
    }
</style>
