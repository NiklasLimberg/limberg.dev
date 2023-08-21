<script lang="ts">
    import type { PageData } from './$types';
    import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
    import PostOverview from '$lib/components/PostOverview.svelte';
    import Fa from 'svelte-fa';

    export let data: PageData;
</script>

<svelte:head>
    <title>limberg.dev DevBlog</title>
    <meta name="description" content="About Niklas Limberg" />
</svelte:head>

<div class="restrict-width center">
    <header>
        <h1>limberg.dev DevBlog</h1>
        <p>Hi, I'm Niklas Limberg and I'm currently working as a software developer at
            <a href="https://shopware.com/" title="shopware AG">Shopware</a>
            with VueJS in Schöppingen at the western most edge of Germany.
            I'm frontend developer interested in all things web.
        </p>
        <p>
            I generally write about the web platform, centered around building progressively enhancement websites
            using the newest features of the platform.
        </p>
    </header>

    <main>
        <section>
            <div class="posts-section-header">
                <h2 style="display: inline">My latest blog posts</h2>
                <a href="/blog">All Posts</a>
            </div>
            {#each data.posts as post}
                <PostOverview
                    title={post.title}
                    path={post.path}
                    description={post.description}
                    date={post.date}
                />
            {/each}
        </section>

        <section>
            <p>I'm also on these social media sites:</p>
            <div class="social-links">
                <a href="https://github.com/NiklasLimberg" title="GitHub Profile"><Fa icon={faGithub} size="2x" /></a>
                <a href="https://twitter.com/Niklas_Limberg" title="Twitter Profile"><Fa icon="{faTwitter}" size="2x" /></a>
            </div>
        </section>
    </main>
    <footer>
        <p>©2023 Niklas Limberg</p>
    </footer>
</div>

<style>
    .center {
        margin: 0 auto;
    }

    .posts-section-header {
        display: flex;
        align-items: end;
        justify-content: space-between;
    }

    .social-links {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
    }
</style>

