<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
</script>
  
<header>
    <h1>Posts</h1>
    <p>All my posts on one page.</p>
</header>

<main>
    {#each data.posts as post}
        <article>
            <h2>
                <a href={post.path}>
                    {post.title}
                </a>
            </h2>
            <div class="description">
                {post.description}
            </div>
            <div>
                Published {post.date}
            </div>
        </article>
    {/each}
</main>

<style>

article {
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 16px;
    margin: 32px 0;
}

article h2 {
    margin: 0 0 16px 0;
}

.description {
    margin-bottom: 16px;
}

</style>