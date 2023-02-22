<script lang="ts">
    import type { PageData } from './$types';
    import { metadata_store } from '$lib/store/metadata';

    export let data: PageData;
    
    metadata_store.set(data.metadata);

    import '$lib/styles/code.css';
    import 'prismjs/themes/prism.css';
</script>

<svelte:head>
    <title>{data.metadata.title}</title>
    <meta name="description" content={data.metadata.description} />
</svelte:head>

<svelte:component this={data.content} />