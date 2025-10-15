<script lang="ts">
  import { onMount } from 'svelte';
  let props = $props();
  const ping = props.ping;

  let stock: any = null;
  let lastPingResult: string = '';

  $effect(() => {
    if (!ping?.Result) return;

    if (ping.Result === 'Success' && ping.Result !== lastPingResult) {
      fetchStock();
    }

    lastPingResult = ping.Result;
  });

  async function fetchStock() {
    try {
      stock = await window.api.getTrainStock();
      console.log('Train stock:', stock);
    } catch (err) {
      console.error('Error fetching train stock:', err);
    }
  }

  // Fetch once on mount
  onMount(async () => {
    await fetchStock();
  });
</script>
