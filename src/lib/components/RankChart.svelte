<script lang="ts">
    import { colourPalette } from '#lib/config.ts';

    let {
        rank,
        maxRank,
        rankCompare,
        comparisonSelected = false,
        name,
        labels
    }: {
        rank?: number;
        maxRank: number;
        rankCompare?: number;
        comparisonSelected?: boolean;
        name?: string;
        labels?: string;
    } = $props();

    let rankProp = $derived(rank ? rank / maxRank : undefined);
    let rankCompareProp = $derived(rankCompare ? rankCompare / maxRank : undefined);

    let minX = -4;
    let minY = $derived(name ? -10 : labels === 'above' ? -5 : labels === 'below' ? -2 : -4);
    let width = 160;
    let height = $derived(name ? 40 : labels ? 20.6 : 16.6);

    let viewBox = $derived(`${minX} ${minY} ${width} ${height}`);
    const scaleWidth = 151.9;
    const scaleGroupX = -33.8;
    const scaleGroupY = $derived(name ? -88.2 : -93.2);
    const rectWidth = 17;
    const rectHeight = 6.6;
    const rectGap = 14.9;
    const rectX = 34.2;
    const rectY = 95.2;

    // mc - colour bar looked heavy with dark outlines round every block - now a slim rounded bar with very light grey lines
    const barHeight = 5.5;
    const barRadius = barHeight / 2;
    const barY = rectY + (rectHeight - barHeight) / 2;
    const barOutline = '#c9c9c9';
    const lastIndex = colourPalette.length - 1;
    const barEndX = rectX + lastIndex * rectGap + rectWidth;

    // mc - round bright markers looked out of place on the bar - now thin upright markers in calmer red and purple
    const markerWidth = 1.4;
    const markerHeight = 7.6;
    const markerColour = '#bf5143';
    const markerCompareColour = $derived(comparisonSelected ? '#8543bf' : '#bf5143');
    const markerCx = $derived(rankProp ? 0.7 + rankProp * (scaleWidth - 1.4) : undefined);
    const markerCompareCx = $derived(rankCompareProp ? 0.7 + rankCompareProp * (scaleWidth - 1.4) : null);
    const markerCy = $derived(rectY + scaleGroupY + rectHeight / 2);

    const labelLeft = '← 1 (Most deprived)';
    const labelMiddle = 'Rank';
    let labelRight = $derived(`(Least deprived) ${maxRank} →`);
    let labelY = $derived(
        labels === 'above' ? -1 : labels == 'below' && name ? 22 : labels == 'below' ? 15 : null
    );
    const labelLeftX = 0;
    const labelMiddleX = 75;
    const labelRightX = 150;

    // mc - area name sat in a box with an arrow - now plain text above the marker with a thin line
    const nameLineColour = '#6b7280';
    let markerTopY = $derived(markerCy - markerHeight / 2);
    let nameHalfWidth = $derived(name ? name.length * 1.05 + 0.5 : 0);
    let nameX = $derived(
        markerCx !== undefined
            ? Math.min(Math.max(markerCx, nameHalfWidth - 3), 155 - nameHalfWidth)
            : 0
    );
</script>

<svg xmlns="http://www.w3.org/2000/svg" {viewBox}>
    <g transform={`translate(${scaleGroupX}, ${scaleGroupY})`}>
        {#each colourPalette as colour, index (index)}
            {@const x = rectX + index * rectGap}
            {#if index === 0}
                <path
                    d={`M ${x + barRadius} ${barY} H ${x + rectGap} V ${barY + barHeight} H ${x + barRadius} A ${barRadius} ${barRadius} 0 0 1 ${x + barRadius} ${barY} Z`}
                    fill={colour}
                />
            {:else if index === lastIndex}
                <path
                    d={`M ${x} ${barY} H ${barEndX - barRadius} A ${barRadius} ${barRadius} 0 0 1 ${barEndX - barRadius} ${barY + barHeight} H ${x} Z`}
                    fill={colour}
                />
            {:else}
                <rect {x} y={barY} width={rectGap} height={barHeight} fill={colour} />
            {/if}
            {#if index > 0}
                <line
                    x1={x}
                    y1={barY}
                    x2={x}
                    y2={barY + barHeight}
                    stroke={barOutline}
                    stroke-width="0.3"
                />
            {/if}
        {/each}
        <rect
            x={rectX}
            y={barY}
            width={barEndX - rectX}
            height={barHeight}
            rx={barRadius}
            fill="none"
            stroke={barOutline}
            stroke-width="0.3"
        />
    </g>
    {#if rankCompare && rankCompare != rank}
        <rect
            x={(markerCompareCx ?? 0) - markerWidth / 2}
            y={markerCy - markerHeight / 2}
            width={markerWidth}
            height={markerHeight}
            rx={markerWidth / 2}
            fill={markerCompareColour}
            stroke="#ffffff"
            stroke-width="0.2"
        />
    {/if}
    {#if rank}
        <rect
            x={(markerCx ?? 0) - markerWidth / 2}
            y={markerCy - markerHeight / 2}
            width={markerWidth}
            height={markerHeight}
            rx={markerWidth / 2}
            fill={markerColour}
            stroke="#ffffff"
            stroke-width="0.2"
        />
    {/if}
    {#if labels}
        <text x={labelLeftX} y={labelY} font-size="5" text-anchor="start">{labelLeft}</text>
        <text x={labelMiddleX} y={labelY} font-size="5" text-anchor="middle">{labelMiddle}</text>
        <text x={labelRightX} y={labelY} font-size="5" text-anchor="end">{labelRight}</text>
    {/if}
    {#if name && rank && markerCx !== undefined}
        <text
            x={nameX}
            y={markerCy - 13}
            font-size="4"
            font-weight="bold"
            text-anchor="middle"
            fill="var(--nisra_purple)"
        >
            {name}
        </text>
        <text x={nameX} y={markerCy - 9} font-size="3.6" text-anchor="middle" fill={nameLineColour}>
            Rank {rank}
        </text>
        <line
            x1={markerCx}
            y1={markerCy - 7.5}
            x2={markerCx}
            y2={markerTopY - 0.4}
            stroke={nameLineColour}
            stroke-width="0.3"
        />
    {/if}
</svg>