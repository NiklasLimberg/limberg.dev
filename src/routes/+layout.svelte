<nav>
    <a href="/">limberg.dev</a>
</nav>
<slot />

<style>
    nav {  
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 16px 0;
    }

    nav a:hover {
        background: inherit;
    }

    @media (min-width: 600px) {
        nav {
            margin: 16px 32px;
        }
    }

    nav a {
        text-decoration: none;
        color: #333;
        font-size: 1.5rem;
        font-weight: 200;   
    }
</style>