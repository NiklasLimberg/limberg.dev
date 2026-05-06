<script lang="ts">
    const {
        src,
        altSrc,
        width,
        height,
        alt,
        loading = 'lazy',
        rounded = false,
    }: {
        src: string;
        altSrc?: string;
        width: number;
        height: number;
        alt: string;
        loading?: 'lazy' | 'eager';
        rounded?: boolean;
    } = $props();
</script>

<picture class:rounded="{rounded}">
    {#if altSrc}
        <source srcset="{altSrc}">
    {/if}
    <img class:rounded="{rounded}" src="{src}" alt="{alt}" width="{width}" height="{height}" loading="{loading}">
</picture>


<style>
    picture, img {
        height: auto;
    }

    .rounded {
        border-radius: 50%;
    }
</style>