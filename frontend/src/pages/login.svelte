<script>
    import { ContentSwitcher, Switch, TextInput, PasswordInput,
        Button, ButtonSet } from "carbon-components-svelte";

    import Login from "carbon-icons-svelte/lib/Login.svelte";
    import logo from "./_components/assets/logo-black.svg";

    import api, {setToken, loadUser} from "./_api";
    import {writable} from "svelte/store";
    import {goto} from "@roxi/routify";

    let username = "";
    let password = "";
    let wrapper

    // let error = "Неверный логин или пароль.";
	$: error = writable("");
    $: ready = writable(true);

    let submitLogin = async () => {
        $error = "";
        $ready = false;

        try {
            const data = await api.user.signIn(username, password);
			console.log(data);
            setToken(data.token);
            wrapper.style.display = "none"
            await loadUser();

            $goto('./', {}, false);
            wrapper.style.display = undefined
        } catch (e) {
            $error = e.message;
        } finally {
	        $ready = true;
        }
    }
</script>

<div class="login--wrapper" bind:this={wrapper}>
	<img class="h-12 w-max" src={logo} alt="logo">
	<div class="login--tile">
		<h3 class="mb-2">Вход в аккаунт</h3>
		<TextInput labelText="Логин" placeholder="ivan.ivanov"
		           invalid={!!$error} invalidText={$error}
		           type="text" bind:value={username} />
		<PasswordInput labelText="Пароль" placeholder="••••••••"
		               bind:value={password}/>
		<ButtonSet class="mt-2" stacked>
			<Button class="bx--btn--full" icon={Login}
			        skeleton={!$ready}
			        on:click={submitLogin}>Войти</Button>
		</ButtonSet>
	</div>
</div>

<style>
	.login--wrapper {
		width: 100%;
		max-width: 480px;

		margin: auto;
		row-gap: 2rem;

		display: flex;
		flex-direction: column;
	}

	.login--tile {
		width: 100%;
		max-width: 480px;

		padding: 1.5rem;
        row-gap: 1rem;

        display: flex;
		flex-direction: column;

        background-color: #eae8e8;
	}
</style>