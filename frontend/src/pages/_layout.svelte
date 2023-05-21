<script>
	import { goto, isActive, url } from "@roxi/routify";
    import { user, loadUser } from './_api';

    import outage from "./_components/assets/outage.svg"

    import Header from './_components/Header.svelte';
    import {Reset} from "carbon-icons-svelte";
    import {Loading, Button} from "carbon-components-svelte";
    import AppDecorator from "./_components/AppDecorator.svelte";
</script>

{#await loadUser()}
	<div class="flex justify-center items-center min-h-screen">
		<Loading withOverlay={false} />
	</div>
{:then _}
	{#if (!$isActive('./login') && !$user)}
		{$goto("./login", {}, false)}
	{:else if ($isActive("./login") && $user)}
		{$goto("./", {}, false)}
	{:else if $user}
		<Header />
	{/if}

	<!-- routify:options preload="proximity" -->
	<slot decorator={AppDecorator} />
{:catch e}
	<div class="flex flex-col justify-center items-center min-h-screen gap-4 text-center">
		<div class="bg-neutral-200 rounded-full p-8">
			<img src={outage} alt="outage" width="96">
		</div>
		<div class="text-2xl font-bold">
			Возникла внутренняя ошибка
		</div>
		<div class="text-gray-600 mb-2">
			Попробуйте обновить страницу <br>
			Технический код ошибки: {e.message}
		</div>
		<Button size="field" icon={Reset} on:click={window.location.reload}>
			Обновить страницу
		</Button>
	</div>
{/await}