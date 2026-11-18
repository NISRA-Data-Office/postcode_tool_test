<script lang="ts">
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    type RankEntry = { name: string; code: string; rank: number; councilRank: number };
    type RawRankEntry = { name: string; code: string; rank: number };

    let {
        ranks,
        type,
        selected = $bindable()
    }: {
        ranks: RawRankEntry[];
        type: 'lgd' | 'ctry';
        selected?: string;
    } = $props();

    let sortCol: 'name' | 'rank' | 'councilRank' = $state('rank');
    let sortDir: 'asc' | 'desc' = $state('asc');
    let tableContainer: HTMLDivElement;
    let tableBody: HTMLElement;

    // mc - a third click on a heading did not return the table to its starting order - headings now cycle up, down, then reset
    function sortBy(col: 'name' | 'rank' | 'councilRank') {
        if (sortCol !== col) {
            sortCol = col;
            sortDir = 'asc';
        } else if (sortDir === 'asc') {
            sortDir = 'desc';
        } else {
            sortCol = 'rank';
            sortDir = 'asc';
        }
    }

    function prepRanks(ranks: RawRankEntry[]): RankEntry[] {
        return [...ranks]
            .sort((a, b) => a.rank - b.rank)
            .map((d, i) => {
                return { ...d, councilRank: i + 1 } as RankEntry;
            });
    }

    let ranksPrep: RankEntry[] = $derived(prepRanks(ranks));

    let sortFn = $derived((a: RankEntry, b: RankEntry) => {
        if (sortDir == 'asc') {
            return a[sortCol] < b[sortCol] ? -1 : 1;
        } else {
            return a[sortCol] > b[sortCol] ? -1 : 1;
        }
    });

    let sortSym = $derived(sortDir === 'asc' ? '▲' : '▼');

    // mc - clicking a column heading did not re-order the table - the table now sorts its own copy and leaves the data alone
    let ranksSorted = $derived([...ranksPrep].sort(sortFn));

    $effect(() => {
        if (selected) {
            let selectedIdx = ranksSorted.findIndex((row) => row.code === selected);
            let selectedRow = tableBody.children[selectedIdx];
            if (selectedRow && selectedRow.offsetTop) {
                tableContainer.scrollTo({
                    top:
                        selectedRow.offsetTop - tableContainer.clientHeight / 2 + selectedRow.clientHeight / 2,
                    behavior: 'smooth'
                });
            }
        } else {
            tableContainer.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
</script>

<div id="table-col" class="col-12 col-xl-5 mb-3">
    <div id="lgd-table-container" bind:this={tableContainer}>
        <table class="lgd-table">
            <thead>
                <tr>
                    <th data-key="niRank" class="cursor-pointer w-25" tabindex="0">
                        <button aria-label="Sort by NI rank" onclick={() => sortBy('rank')}>
                            NI Rank{#if sortCol == 'rank'}
                                {sortSym}{/if}
                        </button>
                    </th>
                    {#if type === 'lgd'}
                        <th data-key="lgdRank" class="cursor-pointer w-30" tabindex="0">
                            <button aria-label="Sort by council rank" onclick={() => sortBy('councilRank')}>
                                Council Rank{#if sortCol == 'councilRank'}
                                    {sortSym}{/if}
                            </button>
                        </th>
                    {/if}
                    <th data-key="name" class="cursor-pointer w-45" tabindex="0">
                        <button
                            aria-label="Sort by neighbourhood alphabetically"
                            onclick={() => sortBy('name')}
                        >
                            Neighbourhood{#if sortCol == 'name'}
                                {sortSym}{/if}
                        </button>
                    </th>
                </tr>
            </thead>
            <tbody bind:this={tableBody}>
                {#each ranksSorted as { name, code, rank, councilRank }, index (index)}
                    <tr
                        class={`sdz-row cursor-pointer ${code === selected ? 'selected' : ''}`}
                        data-code={code}
                        tabindex="-1"
                        aria-label={`Focus map on on ${name}`}
                        onclick={() => (selected = code)}
                    >
                        <td class="border-secondary">{rank}</td>
                        {#if type === 'lgd'}
                            <td class="border-secondary">{councilRank}</td>
                        {/if}
                        <td class="border-secondary">{name}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
    button {
        all: unset;
    }
</style>