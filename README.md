# limberg.dev Devblog

A custom blog built on top of [Svelte Kit](https://kit.svelte.dev/) and [mdsvx](https://mdsvex.com/) statically hosted on [Cloudflare Pages](https://pages.cloudflare.com/).

I use mdsvx with custom remark plugins to add markdown support to Svelte. The remark plugins add `<sections>` elements around headlines and extract a table of content based on the headlines of each individual post. Each post also uses a custom `Header` component to provide [semantic HTML](https://web.dev/learn/html/semantic-html/) for the post title and description.

I designed the blog myself with entirely custom CSS.

The tech stack of this blog was inspired by this blog post by [Josh Collinsworth](https://joshcollinsworth.com/blog/build-static-sveltekit-markdown-blog).
