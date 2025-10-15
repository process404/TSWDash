<script lang="ts">
   let props = $props();
   import { onMount } from 'svelte';

    let stock: any = null;

  onMount(async () => {
    stock = await window.api.getTrainStock();
    console.log('Train stock:', stock);
  });
</script>




