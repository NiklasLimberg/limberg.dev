<div class="full-bleed-wrapper">
    <div>
        <nav>
            <a href="/">Home</a>
            <a href="/blog">Blog</a>
        </nav>
        <slot />
    </div>
    <footer>
        <p>©2023 Niklas Limberg.</p>
    </footer>
</div>

<style>
  .full-bleed-wrapper {
    display: grid;
    grid-template-columns:
      1fr
      min(65ch, 100%)
      1fr;
  }
  .full-bleed-wrapper > * {
    grid-column: 2;
  }
  :global(.full-bleed) {
    width: 100%;
    grid-column: 1 / 4;
  }

  nav {
    margin-top: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>