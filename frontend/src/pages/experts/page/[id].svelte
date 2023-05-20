<script>
    import {
        StructuredList,
        StructuredListHead,
        StructuredListRow,
        StructuredListCell,
        StructuredListBody,
        Button, TextInput, Form,
	    Pagination
    } from "carbon-components-svelte";
    import { Add, Search } from "carbon-icons-svelte";

    import { url } from "@roxi/routify";

    let fullName = "";
    let username = "";
</script>

<div class="w-full flex items-center">
	<h3>Управление экспертами</h3>
	<Button size="field" icon={Add} style="margin-left: auto;"
	        href={$url("/experts/add")}>
		Добавить эксперта
	</Button>
</div>

<div class="paginated-list">
	<!-- добавить await -->
	<div class="grid grid-cols-12 gap-x-10">
		<div class="flex flex-col col-span-8">
			<div class="structured-list--scroll">
				<StructuredList>
					<StructuredListHead>
						<StructuredListRow head>
							<StructuredListCell head>ID</StructuredListCell>
							<StructuredListCell head>Имя эксперта</StructuredListCell>
							<StructuredListCell head>Логин</StructuredListCell>
						</StructuredListRow>
					</StructuredListHead>
					<StructuredListBody>
						<StructuredListRow>
							<StructuredListCell nowrap>1</StructuredListCell>
							<StructuredListCell>Даниил Неслуховский</StructuredListCell>
							<StructuredListCell>АААААААААААААААААААААААААААААААААААААААААААА</StructuredListCell>
						</StructuredListRow>
						<StructuredListRow>
							<StructuredListCell nowrap>2</StructuredListCell>
							<StructuredListCell>Пётр Ильин</StructuredListCell>
							<StructuredListCell>hevav</StructuredListCell>
						</StructuredListRow>
						<StructuredListRow>
							<StructuredListCell nowrap>3</StructuredListCell>
							<StructuredListCell>Егор Алтынов</StructuredListCell>
							<StructuredListCell>skifry</StructuredListCell>
						</StructuredListRow>
					</StructuredListBody>
				</StructuredList>
			</div>
			<Pagination
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

					<Button kind="secondary" size="field" icon={Search}>Поиск</Button>
				</Form>
			</div>
		</div>
	</div>
</div>