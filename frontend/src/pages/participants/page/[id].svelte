<script>
    import {
        StructuredList,
        StructuredListHead,
        StructuredListRow,
        StructuredListCell,
        StructuredListBody,
        Button, TextInput, Form,
        Pagination, SkeletonPlaceholder
    } from "carbon-components-svelte";
    import {Add, Search} from "carbon-icons-svelte";
    import api from '../../_api';

    import { url } from "@roxi/routify";

    let fullName = "";
    let educationPlace = "";
</script>

<div class="w-full flex items-center">
	<h3>Управление участниками</h3>
	<Button size="field" icon={Add} style="margin-left: auto;"
	        href={$url("/participants/add")}>
		Добавить участника
	</Button>
</div>

<div class="paginated-list">
	<!-- добавить await -->
	<div class="grid grid-cols-12 gap-x-10">
		<div class="flex flex-col col-span-8">
			{#await api.participants.list()}
				<SkeletonPlaceholder style="width: 100%; height: 400px" />
			{:then response}
				<div class="structured-list--scroll">
					<StructuredList>
						<StructuredListHead>
							<StructuredListRow head>
								<StructuredListCell head>ID</StructuredListCell>
								<StructuredListCell head>Имя участника</StructuredListCell>
								<StructuredListCell head>Пол</StructuredListCell>
								<StructuredListCell head>Дата рождения</StructuredListCell>
								<StructuredListCell head>Статус участия</StructuredListCell>
								<StructuredListCell head>Компетенции</StructuredListCell>
								<StructuredListCell head>Университет</StructuredListCell>
								<StructuredListCell head>Год окончания</StructuredListCell>
								<StructuredListCell head>Профессия</StructuredListCell>
								<StructuredListCell head>Место работы</StructuredListCell>
							</StructuredListRow>
						</StructuredListHead>
						<StructuredListBody>
							{#each response.items as item}
								<StructuredListRow>
									<StructuredListCell nowrap>{item.id}</StructuredListCell>
									<StructuredListCell>{item.fio}</StructuredListCell>
									<StructuredListCell>{item.gender === 0 ? "Женский" : "Мужской"}</StructuredListCell>
									<StructuredListCell>{item.dob}</StructuredListCell>
									<StructuredListCell>{item.participating ? "Участник мероприятия" : "Участник не в оценке"}</StructuredListCell>
									<StructuredListCell>{item.competitions.join(", ")}</StructuredListCell>
									<StructuredListCell>{item.education[0].place}</StructuredListCell>
									<StructuredListCell>{item.education[0].ended}</StructuredListCell>
									<StructuredListCell>{item.work.position}</StructuredListCell>
									<StructuredListCell>{item.work.company}</StructuredListCell>
								</StructuredListRow>
							{/each}
						</StructuredListBody>
					</StructuredList>
				</div>
				<Pagination
						totalItems={100} pageSizes={[10, 15, 20]}
						forwardText="Следующая станица"
						backwardText="Предыдущая страница"
						itemsPerPageText="Участников на странице"
						itemRangeText={(min, max, total) => `${min}–${max} из ${total} участник${max === 1 ? "а" : "ов"}`}
						pageRangeText={(current, total) => `из ${total} страниц${total === 1 ? "ы" : ""}`}
				/>
			{/await}
		</div>
		<div class="col-span-4">
			<div class="flex flex-col bg-gray-100 p-4 gap-y-4">
				<h5 class="text-black font-bold">Фильтры</h5>

				<Form class="form-wrapper">
					<TextInput labelText="Поиск по имени" placeholder="Иванов Иван Иванович"
					           class="form-input" type="text" bind:value={fullName} />
					<TextInput labelText="Поиск по университету" placeholder="Москва"
					           class="form-input" type="text" bind:value={educationPlace} />

					<Button kind="secondary" size="field"
					        style="width: 100%; margin-top: .5rem;" icon={Search}>Поиск</Button>
				</Form>
			</div>
		</div>
	</div>
</div>