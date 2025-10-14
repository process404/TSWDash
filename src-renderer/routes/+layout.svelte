<script lang="ts">
	import '../app.css';
	import Devtools from '$lib/Devtools.svelte';
	import { preferredTheme } from '$lib/preferredTheme.svelte';
	import { formationError } from '$lib/stores';
	import { onDestroy } from 'svelte';

	let { children } = $props();

	$effect(() => {
		if(preferredTheme.theme === 'dark') window.setTitleBarColors('#374151', '#f8fafc');
		else window.setTitleBarColors('#e5e7eb', '#020617');
	});

	const openDetails = document.querySelector('details[open]') as HTMLDetailsElement | null;

	function closeDropdown() {
		const openDetails = document.querySelector('details[open]');
		if (openDetails instanceof HTMLDetailsElement) {
			openDetails.open = false;
		}
	}

	function handleClickOutside(event: MouseEvent) {
		const openDetails = document.querySelector('details[open]');
		if (openDetails instanceof HTMLDetailsElement && !openDetails.contains(event.target as Node)) {
			openDetails.open = false;
		}
	}

	document.addEventListener('click', handleClickOutside);
</script>

<div id='titlebar' class='shrink-0 bg-gradient-to-r from-gray-100 to-gray-200 flex text-slate-950 dark:from-[#273141] dark:to-gray-700 dark:text-slate-50'>
	<div class='px-4 select-none grow text-xs flex items-center' style='-webkit-app-region: drag;'>Example App</div>
	{#if import.meta.env.DEV}
		<Devtools/>
	{/if}
</div>
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class='overflow-auto h-full bg-gradient-to-br from-white to-zinc-50 text-slate-950 dark:from-base-100 dark:to-base-100 dark:text-slate-50'>
	{#if $formationError}
		<div class="bg-orange-600 pb-1 text-white text-center font-semibold h-[15px] text-xs">
			No live game detected
		</div>
	{/if}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<nav class="bg-base-100 shadow-sm border-b-[1px] border-b-neutral-900 justify-between flex items-center" onclick={(e) => e.stopPropagation()}>
		<a class="btn btn-ghost text-sm">TSW Link</a>
		<details class="dropdown dropdown-end">
			<summary class="btn m-1 btn-ghost text-sm">☰</summary>
			<ul class="menu dropdown-content bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm">
				<li><a href="/" onclick={closeDropdown}>Home</a></li>
				<li><a href="/settings" onclick={closeDropdown}>Settings</a></li>
			</ul>
		</details>
	</nav>
	{@render children()}
</div>

<style>
	#titlebar {
		margin-right: env(titlebar-area-x);
		width: env(titlebar-area-width);
		height: env(titlebar-area-height);
	}
</style>