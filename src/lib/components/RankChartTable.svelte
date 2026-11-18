<script lang="ts">
    import { asset } from '$app/paths';
    // mc - info panel snapped open and shut - now slides
    import { slide } from 'svelte/transition';
    import RankChart from './RankChart.svelte';
    import { domains } from '#lib/config.ts';
    import DomainDescription from './DomainDescription.svelte';

    let {
        ranks,
        maxRank
    }: {
        ranks: { [key: string]: number };
        maxRank: number;
    } = $props();

    let expanded = $state(domains.map(() => false));

    function toggleDetails(index: number) {
        expanded[index] = !expanded[index];
    }
</script>

{#each domains as { code, label }, index (code)}
    <div class={index == 0 ? 'row border-bottom border-dark mb-3' : 'row'}>
        <div class="col-12 col-xl-4 text-xl-end d-flex flex-column justify-content-center">
            <!-- mc - button gave no sign of being open or focused - now reports its state and shows focus -->
            <button
                type="button"
                onclick={() => toggleDetails(index)}
                class="mb-0 text-blue cursor-pointer fs-5"
                aria-expanded={expanded[index]}
                aria-controls={`domain-info-${code}`}
                >{label}
                <img
                    src={asset('assets/img/logo/i-button.svg')}
                    width="18"
                    alt={expanded[index] ? 'Hide information' : 'Show information'}
                    class:i-open={expanded[index]}
                />
            </button>
            <p>Rank {ranks[code]}</p>
        </div>
        <div class="col-12 col-xl-8">
            {#if index === 0}
                <RankChart rank={ranks[code]} {maxRank} labels="above" />
            {:else if index + 1 === domains.length}
                <RankChart rank={ranks[code]} {maxRank} labels="below" />
            {:else}
                <RankChart rank={ranks[code]} {maxRank} />
            {/if}
        </div>
        {#if expanded[index]}
            <!-- mc - info panel sat outside the page columns - now a full-width column that lines up -->
            <div id={`domain-info-${code}`} class="col-12" transition:slide={{ duration: 200 }}>
                <div class="i-text-panel is-open border border-secondary mb-3">
                    <div class="d-flex flex-row align-items-start p-2">
                        <img
                            src={asset('assets/img/logo/i-button.svg')}
                            width="18"
                            class="me-2 mt-1"
                            alt=""
                        />
                        <div class="mb-0"><DomainDescription domain={code} /></div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
{/each}

<style>
    button {
        all: unset;
        cursor: pointer;
    }
    button:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 2px;
    }
    .i-open {
        opacity: 0.55;
    }
</style>