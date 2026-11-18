<script lang="ts">
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import searchData from '#lib/assets/postcode.json';

    type Match = {
        areaCode: string;
        areaName: string;
        postcode: string;
        search: string;
        spaced: string;
    };

    let selectedIndex = $state(-1);
    let submitted = $state(false);
    // mc - list of postcodes never went away - now closes on click away, Escape, or after choosing one
    let open = $state(false);
    let inputText: string | undefined = $state();

    let isPostcode = $derived(inputText && inputText.slice(0, 2).toLowerCase() == 'bt');
    let postcodeLookup: Match[] = Object.entries(searchData)
        .map((entry) => {
            return entry[1].codes.map((postcode) => ({
                areaCode: entry[0],
                areaName: entry[1].name,
                postcode: postcode,
                search: cleanPostcode(postcode),
                spaced: tidyPostcode(postcode)
            }));
        })
        .flat();

    // mc - postcodes typed without a space were not found - spaces are ignored unless the user types one
    function cleanPostcode(postcode: string): string {
        return postcode.toUpperCase().replaceAll(/\s+/g, '');
    }

    function tidyPostcode(postcode: string): string {
        return postcode.toUpperCase().trimStart().replaceAll(/\s+/g, ' ');
    }

    function loadOptions(query: string): Match[] {
        const typed = tidyPostcode(query);
        const cleaned = cleanPostcode(query);
        if (!isPostcode || cleaned.length < 3) return [];
        const hasSpace = typed.includes(' ');
        const candidates = postcodeLookup.filter((x) =>
            hasSpace ? x.spaced.startsWith(typed) : x.search.startsWith(cleaned)
        );
        const results = candidates.sort((a, b) => (a.postcode < b.postcode ? -1 : 1)).slice(0, 10);
        return results;
    }

    let currentMatches = $derived(inputText ? loadOptions(inputText) : []);
    let cleanedInput = $derived(cleanPostcode(inputText ?? ''));

    // mc - "No results found" only showed some of the time - now shows as soon as the typed text has no match
    let showInvalid = $derived(
        open &&
            cleanedInput.length > 0 &&
            currentMatches.length === 0 &&
            (cleanedInput.length >= 3 || submitted)
    );

    // mc - choosing a postcode did not open its area page - page link is now built correctly, in one place
    function goToMatch(match: { areaCode: string; postcode: string }) {
        const query = new URLSearchParams({ postcode: match.postcode });
        open = false;
        submitted = false;
        goto(`${resolve('/areas/[code]', { code: match.areaCode })}?${query}`);
    }

    function submit() {
        if (currentMatches.length > 0) {
            goToMatch(currentMatches[0]);
        } else {
            open = true;
            submitted = true;
        }
    }
</script>

<div
    id="postcode-search"
    class="position-relative"
    onfocusout={(ev) => {
        if (!ev.currentTarget.contains(ev.relatedTarget as Node | null)) {
            open = false;
            submitted = false;
        }
    }}
>
    <div class="input-group">
        <input
            id="postcode-input"
            type="search"
            class="form-control rounded-0 border-secondary"
            placeholder="Search for a postcode"
            aria-label="Search for a postcode"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            oninput={() => {
                open = true;
                submitted = false;
            }}
            onfocus={() => (open = true)}
            onkeydown={(ev) => {
                if (ev.key === 'Escape') open = false;
                if (ev.key === 'Enter') submit();
            }}
            bind:value={inputText}
        />
        <!-- mc - search button did nothing when clicked - now goes to the top result -->
        <button
            id="postcode-go"
            class="btn rounded-0 border-secondary bg-purple"
            type="button"
            aria-label="Search"
            onclick={submit}
        >
            <i class="bi bi-search"></i>
        </button>
        {#if open && currentMatches.length > 0}
            <div
                id="postcode-dropdown"
                class="postcode-dropdown border border-secondary position-absolute"
            >
                {#each currentMatches as { postcode, areaName, areaCode }, index (postcode)}
                    <button
                        type="button"
                        class="postcode-dropdown__item d-block w-100 p-2 border-0 border-bottom text-start"
                        role="option"
                        aria-selected="false"
                        onclick={() => goToMatch({ areaCode, postcode })}
                        onmouseenter={() => (selectedIndex = index)}
                    >
                        <strong>{postcode}</strong> View <strong>{areaName}</strong>
                    </button>
                {/each}
            </div>
        {/if}
        {#if showInvalid}
            <div
                id="postcode-invalid"
                class="postcode-invalid text-danger mt-1 position-absolute border border-secondary bg-white p-1"
            >
                No results found. Please check your postcode or area name and try again.
            </div>
        {/if}
    </div>
</div>