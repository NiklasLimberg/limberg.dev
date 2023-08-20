<script>
    import { page } from '$app/stores';
</script>

<h1 class="error-message">{$page.error?.message ?? 'Internal Server Error'}</h1>

<style>
.error-message {
    margin: 0 32px;
}
</style>