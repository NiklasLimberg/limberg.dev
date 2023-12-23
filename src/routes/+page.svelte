<script lang="ts">
    import type { PageData } from './$types';
    import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
    import PostOverview from '$lib/components/PostOverview.svelte';
    import Image from '$lib/components/Image.svelte';
    import Fa from 'svelte-fa';

    export let data: PageData;
</script>

<svelte:head>
    <title>limberg.dev DevBlog</title>
    <meta name="description" content="About Niklas Limberg" />
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
                    I'm software developer interested in all things web.
                </p>
                <div class="social-links">
                    <a href="https://github.com/NiklasLimberg" title="GitHub Profile">
                        <Fa icon={faGithub} size="2x" />
                    </a>
                    <a href="https://twitter.com/Niklas_Limberg" title="Twitter Profile">
                        <Fa icon="{faTwitter}" size="2x" />
                    </a>
                </div>
            </div>
        </div>
        <div>
            <h2>About me</h2>
            <p>
                I'm currently working on open source at
                <a href="https://shopware.com/" title="shopware AG">shopware AG</a>
                primarily with TypeScript and VueJS.
            </p>
            <p>
                I generally write about the web platform, centered around building progressively enhanced websites
                using the newest features of the platform.
            </p>
        </div>
    </header>

    <main >
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

