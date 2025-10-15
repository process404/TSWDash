<script lang="ts">
   import { latestPingResponse, sessionActive, startPingFormationLoop, pingPoint } from '$lib/stores/sessionTracker';

   startPingFormationLoop();
</script>

{#if $sessionActive}
    <pre class="text-xs">{JSON.stringify($latestPingResponse, null, 2)}</pre>
{:else}
    <p class="text-sm italic text-gray-500">No active game session.</p>
{/if}

