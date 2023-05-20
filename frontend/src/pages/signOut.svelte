<script>
	import {onMount} from "svelte";
	import api, {removeToken} from "./_api";

    removeToken();
    window.location.reload();
</script>

Выходим из аккаунта...