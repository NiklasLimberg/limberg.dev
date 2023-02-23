<script lang="ts">
    import Fa from 'svelte-fa';
    import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
</script>

<svelte:head>
    <title>limberg.dev DevBlog</title>
    <meta name="description" content="About Niklas Limberg" />
</svelte:head>

<main>
    <h1>limberg.dev DevBlog</h1>
    <p>Hi, I'm Niklas Limberg and I'm currently working as a software developer at
        <a href="https://shopware.com/">Shopware</a> 
        with VueJS in Schöppingen at the western most edge of Germany.
        I'm frontend developer interested in all things web.
    </p>
    <p>
        I generally write about the web platform, centered around building progressively enhancement websites
        using the newest features of the platform.
    </p>
    <p>You can find my blog posts <a href="/blog" title="An overview of all my posts.">here</a></p>

    <p>I'm also on these social media sites:</p>
    <div class="social-links">
        <a href="https://github.com/NiklasLimberg" title="GitHub Profile"><Fa icon={faGithub} size="2x" /></a>
        <a href="https://twitter.com/Niklas_Limberg" title="Twitter Profile"><Fa icon="{faTwitter}" size="2x" /></a>
    </div>
</main>

<style>
    .social-links {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
    }
</style>

