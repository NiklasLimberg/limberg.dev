<script lang="ts">
    import type { PageData } from './$types';
    import { resolve } from '$app/paths';
    import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
    import PostOverview from '$lib/components/PostOverview.svelte';
    import Image from '$lib/components/Image.svelte';
    import Fa from 'svelte-fa';

    const { data }: { data: PageData } = $props();
</script>

<svelte:head>
    <title>limberg.dev DevBlog</title>
    <meta name="description" content="Niklas Limberg — frontend engineer writing about the web platform." />
</svelte:head>

<div class="restrict-width center">
    <header>
        <div class="header-grid">
            <Image
                alt="Headshot of me"
                src="/img/home/headshot.jpg"
                altSrc="/img/home/headshot.jpg"
                height={1000}
                width={1000}
                rounded={true}
                loading="eager">
            </Image>
            <div>
                <h1>
                    Hi! I'm Niklas.
                </h1>
                <p>
                    Frontend / web engineer working primarily with TypeScript.
                </p>
                <div class="social-links">
                    <a href="https://github.com/NiklasLimberg" title="GitHub Profile">
                        <Fa icon={faGithub} size="2x" />
                    </a>
                    <a href="https://twitter.com/Niklas_Limberg" title="Twitter Profile">
                        <Fa icon={faTwitter} size="2x" />
                    </a>
                </div>
            </div>
        </div>
        <div>
            <h2>About me</h2>
            <p>
                I currently work as a software engineer at
                <a href="https://check24.de/" title="Check24">Check24 Hotel Connect</a>
                in Essen, Germany, where I've been building React frontends with TypeScript,
                React Hook Form, and TanStack libraries since May 2024. Most of that work is closed source.
            </p>
            <p>
                Before that I worked at
                <a href="https://shopware.com/" title="shopware AG">shopware AG</a>
                on the Vue-based Administration UI — a lot of how I think about frontend development was shaped there.
            </p>
            <p>
                The easiest way to reach me is via email at
                <a href="mailto:niklas@limberg.dev">niklas@limberg.dev</a>.
            </p>
        </div>
    </header>

    <main >
        <section>
            <div class="posts-section-header">
                <h2 style="display: inline">My latest blog posts</h2>
                <a href={resolve('/blog')}>All Posts</a>
            </div>
            {#each data.posts as post (post.slug)}
                <PostOverview
                    title={post.title}
                    slug={post.slug}
                    description={post.description}
                    date={post.date}
                />
            {/each}
        </section>
    </main>
    <footer>
        <p>© {new Date().getFullYear()} Niklas Limberg</p>
    </footer>
</div>

<style>
    .header-grid {
        display: grid;
        grid-template-columns: 40% 60%;
        align-items: center;
        gap: 32px;
        margin-bottom: 32px;
    }

    .header-grid h1 {
        margin: 0;
    }

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
    }
</style>

