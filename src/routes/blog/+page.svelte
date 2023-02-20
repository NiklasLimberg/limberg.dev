<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
</script>
  
<header>
    <h1>Blog Listing Page</h1>
</header>

<main>
    <ol>
        {#each data.posts as post}
            <li>
                <h2>
                    <a href={post.path}>
                        {post.title}
                    </a>
                </h2>
                <div>
                    {post.description}
                </div>
                <div>
                    Published {post.date}
                </div>
            </li>
        {/each}
    </ol>
</main>

<style>
ol {
  list-style-type: none;
  padding: 0;
}
</style>