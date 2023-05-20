<script>
    import logo from "./assets/logo.svg";
    import { url, goto } from "@roxi/routify";
    import { user } from '../_api';
    import { OverflowMenu, OverflowMenuItem } from "carbon-components-svelte";

    let links = {
        "Главная": "/",
	    "Статистика": "/stats",
	    "Участники": "/participants",
	    "Оценки": "/ratings",
	    "Эксперты": "/experts"
    }
</script>

<div class="w-full h-[4rem] mb-6 flex bg-black">
	<div class="container px-4 mx-auto flex items-center">
		<img class="h-[1.75rem] mr-8 cursor-pointer" src={logo} alt="Логотип"
		     on:click={() => $goto("/")} on:keyup={() => $goto("/")}>

		<div class="flex items-center ml-12 gap-x-8 text-white w-full h-full">
			{#each Object.entries(links) as [title, link]}
				<a class="h-full text-white flex items-center px-2"
				   href={$url(link)}>{title}</a>
			{/each}
		</div>

		<OverflowMenu class="overflow-menu ml-auto" flipped>
			<div slot="menu" class="w-auto h-full text-white
				flex items-center whitespace-nowrap">
				{$user.firstName} {$user.lastName}
			</div>
			<OverflowMenuItem
					href={$url("/profile")}
					text="Профиль" />
			<OverflowMenuItem
					href={$url("/signOut")}
					text="Выйти из аккаунта" />
		</OverflowMenu>
	</div>
</div>

<style>
	:global(.overflow-menu) {
		width: auto;
		height: 100%;
    }

	:global(.overflow-menu:hover,
			.overflow-menu.bx--overflow-menu--open) {
		background: inherit !important;
	}

	:global(.overflow-menu .bx--overflow-menu-options:after) {
		display: none !important;
	}

	:global(.overflow-menu:focus) {
        outline: medium auto currentColor;
	}

	:global(.overflow-menu:not(:focus-visible),
			.overflow-menu .bx--overflow-menu-options__btn:not(:focus-visible)) {
		outline: none !important;
	}
</style>