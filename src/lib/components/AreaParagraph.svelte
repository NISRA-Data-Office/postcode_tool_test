<script lang="ts">
	import { headline, paragraph } from '#lib/util/textHelpers.ts';

	let {
		name,
		mdmRank,
		count
	}: {
		name: string;
		mdmRank: number;
		count: number;
	} = $props();
	// shouldn't include the areas rank too
	let percent = $derived((mdmRank - 1) / count);
</script>

<h3 class="h2 mt-4">
	<span class="text-purple fw-bold">{name}</span>
	{headline(mdmRank, count, percent)}
</h3>

<p id="deprivation-paragraph" class="fs-4">
	{paragraph(mdmRank, count, percent)} <span class="text-purple fw-bold">{name}</span>.
</p>
