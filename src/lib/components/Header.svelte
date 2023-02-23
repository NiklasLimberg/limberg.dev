<script lang="ts">
    import { formatDate } from '$lib/formater/date';
    import { metadata_store } from '$lib/store/metadata';
    
    let title: string;
    let publishedDate: string;

    metadata_store.subscribe(metadata => {
        title = metadata.title;
        publishedDate = formatDate(metadata.date);
    });

</script>



<header>
    <h1>{title}</h1>
    <div class="publishedDate">Published {publishedDate}</div>

    <slot />
</header>

<style>
    .publishedDate {
        font-size: 0.8em;
        color: #666;
        margin-bottom: 16px;
    }
</style>