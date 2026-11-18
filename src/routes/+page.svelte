<script lang="ts">
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import PostcodeSearch from '#lib/components/PostcodeSearch.svelte';
    import LgdSelect from '#lib/components/LgdSelect.svelte';

    function handleLgdSelect(event: Event) {
        const selectElement = event.target as HTMLSelectElement;
        const code = selectElement.value;
        goto(resolve(`areas/${code}`));
    }
</script>

<svelte:head>
    <title>Deprivation in Northern Ireland - Home</title>
</svelte:head>

<main class="flex-grow-1 d-flex flex-column">
    <div id="content" class="flex-grow-1 d-flex flex-column">
        <!-- Main Content -->
        <div id="background-map" class="container flex-grow-1">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-12 col-md-6 col-xl-5 mb-3">
                        <div class="card home-card home-card-blue h-100 d-flex flex-column rounded-0 border-secondary">
                            <div class="card-body d-flex flex-column justify-content-between">
                                <p class="fs-2 mb-2">Find out about deprivation in your neighbourhood:</p>

                                <PostcodeSearch />
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-md-6 col-xl-5 mb-3">
                        <div class="card home-card home-card-green h-100 d-flex flex-column rounded-0 border-secondary">
                            <div class="card-body d-flex flex-column justify-content-between">
                                <p class="fs-2 mb-2">Explore deprivation by council area:</p>

                                <LgdSelect handleSelect={handleLgdSelect} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    .home-card {
        position: relative;
    }

    .home-card::before {
        content: '';
        position: absolute;
        top: -1px;
        left: -1px;
        right: -1px;
        z-index: 1;
        height: 4px;
        background-color: transparent;
        transition: background-color 0.15s ease;
        pointer-events: none;
    }

    .home-card-blue:hover::before,
    .home-card-blue:focus-within::before {
        background-color: var(--nisra_blue);
    }

    .home-card-green:hover::before,
    .home-card-green:focus-within::before {
        background-color: var(--nisra_green, var(--nisra_blue));
    }
</style>