<script lang="ts">
    export let src: string;
    export let altSrc: string|undefined;
    export let height: number;
    export let alt: string;
</script>

<div class="wrapper-absolute">
    <div class="wrapper-flex">
        <picture>
            {#if altSrc}
                <source srcset="{altSrc}">
            {/if}
            <img src="{src}" alt="{alt}" height="{height}" loading="lazy">
        </picture>
    </div>
</div>

<style>
    .wrapper-absolute {
        width: 99vw;
        position: relative;
        left: 50%;
        margin-left: -50vw;
    }
    
    .wrapper-flex {
        margin: 32px;
        display: flex;
        justify-content: center;
    }

    picture {
        max-width: 100ch;
    }
</style>