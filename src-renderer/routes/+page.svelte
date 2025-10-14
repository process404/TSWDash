<script lang="ts">
	import MapComponent from '$lib/components/mapComponent.svelte';
	import { latestPingResponse, sessionActive, startPingFormationLoop } from '$lib/stores/sessionTracker';

	startPingFormationLoop();
</script>

<div>
	{#if $sessionActive}
		<MapComponent />
		<pre class="text-xs">{JSON.stringify($latestPingResponse, null, 2)}</pre>
	{:else}
		<p class="text-sm italic text-gray-500">No active game session.</p>
	{/if}
</div>
