<script>
	import {
        BarChartSimple
    } from "@carbon/charts-svelte";
    import {
	    SkeletonPlaceholder
    } from "carbon-components-svelte";
    import api from "./_api";
    import {onMount} from "svelte";

    onMount(async () => {
        const data = await api.participants.list();
    })

	const groupBy = (data, callback) => {
        const groups = {};

        for(const item of data.items) {
            const key = callback(item);
            groups[key] = (groups[key] || 0) + 1;
        }

        return Object.entries(groups).map(
            ([k, v]) => ({"group": k, "value": v})
        );
    }

    const groupByEduProfession = (data) => groupBy(data, item => item["education"][0]["profession"]);
    const groupByEducation = (data) => groupBy(data, item => item["education"][0]["place"]);
</script>

{#await api.participants.list()}
	<SkeletonPlaceholder style="width: 100%; height: 400px" />
{:then response}
	<BarChartSimple
		class="px-4"
		data={groupByEduProfession(response)}
		options={{
            title: "Статистика по изученным профессиям",
            height: "400px",
            axes: {
				left: { mapsTo: "value" },
				bottom: { mapsTo: "group", scaleType: "labels" },
			},
        }}
	/>
	<BarChartSimple
			class="px-4 mb-8"
			data={groupByEducation(response)}
			options={{
            title: "Статистика по университету",
            height: "400px",
            axes: {
				left: { mapsTo: "value" },
				bottom: { mapsTo: "group", scaleType: "labels" },
			},
        }}
	/>
{/await}
