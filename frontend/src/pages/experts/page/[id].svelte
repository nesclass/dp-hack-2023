<script>
    import {
        StructuredList,
        StructuredListHead,
        StructuredListRow,
        StructuredListCell,
        StructuredListBody,
        Button, TextInput, Form,
        Pagination, StructuredListSkeleton
    } from "carbon-components-svelte";
    import { Add, Search } from "carbon-icons-svelte";

    import { url } from "@roxi/routify";
    import api from "../../_api";

    let fullName = "";
    let username = "";
    let pageSize = 10;
</script>

<div class="w-full flex items-center">
	<h3>Управление экспертами</h3>
	<Button size="field" icon={Add} style="margin-left: auto;"
	        href={$url("/experts/add")}>
		Добавить эксперта
	</Button>
</div>

<div class="paginated-list">
	<div class="grid grid-cols-12 gap-x-10">
		<div class="flex flex-col col-span-8">
			<div class="structured-list--scroll">
				{#await api.user.list()}
					<StructuredListSkeleton rows={pageSize} />
				{:then response}
				<StructuredList>
					<StructuredListHead>
						<StructuredListRow head>
							<StructuredListCell head>ID</StructuredListCell>
							<StructuredListCell head>Имя эксперта</StructuredListCell>
							<StructuredListCell head>Логин</StructuredListCell>
						</StructuredListRow>
					</StructuredListHead>
					<StructuredListBody>
						{#each response.items as item}
							<StructuredListRow>
								<StructuredListCell nowrap>{item.id}</StructuredListCell>
								<StructuredListCell>{item.lastName} {item.firstName} {item.middleName}</StructuredListCell>
								<StructuredListCell>{item.login}</StructuredListCell>
							</StructuredListRow>
						{/each}
					</StructuredListBody>
				</StructuredList>
					{:catch e}

				{/await}
			</div>
			<Pagination
					bind:pageSize={pageSize}
					totalItems={3} pageSizes={[10, 15, 20]}
					forwardText="Следующая станица"
					backwardText="Предыдущая страница"
					itemsPerPageText="Экспертов на странице"
					itemRangeText={(min, max, total) => `${min}–${max} из ${total} эксперт${max === 1 ? "а" : "ов"}`}
					pageRangeText={(current, total) => `из ${total} страниц${total === 1 ? "ы" : ""}`}
			/>
		</div>
		<div class="col-span-4">
			<div class="flex flex-col bg-gray-100 p-4 gap-y-4">
				<h5 class="text-black font-bold">Фильтры</h5>

				<Form class="form-wrapper">
					<TextInput labelText="Поиск по имени" placeholder="Иванов Иван Иванович"
					           class="form-input" type="text" bind:value={fullName} />
					<TextInput labelText="Поиск по логину" placeholder="ivan.ivanov"
					           class="form-input" bind:value={username} />

					<Button kind="secondary" size="field"
					        style="width: 100%; margin-top: .5rem;" icon={Search}>Поиск</Button>
				</Form>
			</div>
		</div>
	</div>
</div>