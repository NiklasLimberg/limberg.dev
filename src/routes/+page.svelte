<script lang="ts">
    import Fa from 'svelte-fa';
    import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
</script>

<main>
    <h1>limberg.dev DevBlog</h1>
    <p>Hi, I'm Niklas Limberg and I'm currently working as a software developer at
        <a href="https://shopware.com/">Shopware</a> 
        with VueJS in Schöppingen at the western most edge of Germany.
        I'm frontend developer interested in all things web.
    </p>
    <p>
        I write about the web platform centered around building progressively enhancement websites
        using the newest features of the platform.
    </p>
    <p>You can find my blog posts <a href="/blog">here</a></p>

    <div class="social-links">
        <span>I'm also on these social media sites:</span>
        <a href="https://github.com/NiklasLimberg" title="GitHub Profile"><Fa icon={faGithub} /></a>
        <a href="https://twitter.com/Niklas_Limberg" title="Twitter Profile"><Fa icon="{faTwitter}" /></a>
    </div>
</main>

<style>
    .social-links {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
    }
</style>

