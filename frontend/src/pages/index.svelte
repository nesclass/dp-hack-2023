<script>
	import { BarChartSimple } from "@carbon/charts-svelte";
    import {
        StructuredList,
        StructuredListHead,
        StructuredListRow,
        StructuredListCell,
        StructuredListBody,
    } from "carbon-components-svelte";
</script>

<BarChartSimple
		class="px-4"
		data={[
            { group: "Москва", value: 650 },
            { group: "Екатеринбург", value: 291 },
            { group: "Санкт-Петербург", value: 352 },
            { group: "Подольск", value: 512 },
            { group: "Владивосток", value: 169 },
        ]}
		options={{
            title: "Статистика по городам",
            height: "400px",
            axes: {
				left: { mapsTo: "value" },
				bottom: { mapsTo: "group", scaleType: "labels" },
			},
        }} />

<StructuredList>
	<StructuredListHead>
		<StructuredListRow head>
			<StructuredListCell head>ID</StructuredListCell>
			<StructuredListCell head>Имя участника</StructuredListCell>
			<StructuredListCell head>Город</StructuredListCell>
			<StructuredListCell head>Категория</StructuredListCell>
		</StructuredListRow>
	</StructuredListHead>
	<StructuredListBody>
		<StructuredListRow>
			<StructuredListCell nowrap>1</StructuredListCell>
			<StructuredListCell>Даниил Неслуховский</StructuredListCell>
			<StructuredListCell>Москва</StructuredListCell>
			<StructuredListCell>Надзиратель зоопарка</StructuredListCell>
		</StructuredListRow>
		<StructuredListRow>
			<StructuredListCell nowrap>2</StructuredListCell>
			<StructuredListCell>Пётр Ильин</StructuredListCell>
			<StructuredListCell>Подольск</StructuredListCell>
			<StructuredListCell>Сварка аргоновых котлов в 40 атмосфер</StructuredListCell>
		</StructuredListRow>
		<StructuredListRow>
			<StructuredListCell nowrap>3</StructuredListCell>
			<StructuredListCell>Егор Алтынов</StructuredListCell>
			<StructuredListCell>Подольск</StructuredListCell>
			<StructuredListCell>ИИшник</StructuredListCell>
		</StructuredListRow>
	</StructuredListBody>
</StructuredList>