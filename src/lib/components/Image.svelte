<script lang="ts">
    export let src: string;
    export let altSrc: string|undefined;
    export let width: number;
    export let height: number;
    export let alt: string;
    export let loading: 'lazy'|'eager' = 'lazy' ;
</script>

<picture>
    {#if altSrc}
        <source srcset="{altSrc}">
    {/if}
    <img src="{src}" alt="{alt}" width="{width}" height="{height}" loading="{loading}">
</picture>


<style scoped>
    picture, img {
        height: auto;
    }
</style>