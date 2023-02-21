<script lang="ts">
    import type { PageData } from './$types';
    import { metadata_store } from '$lib/store/metadata';

    export let data: PageData;
    
    metadata_store.set(data.metadata);

    import '$lib/styles/code.css';
</script>

<svelte:component this={data.content} />