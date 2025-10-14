<div>
	<dialog id="success_modal" class="modal">
		<div class="modal-box">
			<h3 class="text-lg font-bold">{{modalmsg}}</h3>
			<p class="py-4">{{modaldesc}}</p>
			<div class="modal-action">
			<form method="dialog">
				<button class="btn">Close</button>
			</form>
			</div>
		</div>
	</dialog>
	<div class="h-[200px] bg-blue-900 flex items-center justify-center">
		<h1 class='text-center text-5xl leading-tight bg-blue-780'>
			Settings
		</h1>
	</div>
	<div class="p-12 flex items-center justify-center">
		<div class="max-w-[1200px] w-full items-center justify-start">
			<h2 class="text-3xl font-bold mb-8">Essentials</h2>
			<hr class="border-neutral-900 mb-8">
			<div class="flex gap-8 w-full md:flex-row flex-col">
				<div class="flex flex-col w-full">
					<div class="card-actions">
						<fieldset class="flex w-full items-center justify-start gap-4">
							<h3>TSW API Address</h3>
							<input type="text" class="input" placeholder="Type here" bind:value={hostaddress} />
						</fieldset>
					</div>
				</div>
				<div class="flex flex-col w-full">
					<div class="card-actions">
						<!-- svelte-ignore a11y_missing_attribute -->
						<fieldset class="flex w-full items-center justify-start gap-4">
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<h3 class="flex gap-4">TSW API Key<a class="mr-1 mr-1 opacity-20 hover:opacity-100 duration-100 hover:cursor-pointer" onclick={openDTG}>🛈</a></h3>
							<input type="text" class="input" placeholder="Type here" bind:value={apikey} />
						</fieldset>
					</div>
				</div>
			</div>
			<hr class="border-neutral-900 mt-8 mb-8">
			<div class="flex">
				<button class="btn btn-primary" onclick={saveSettings}>Save Settings</button>
			</div>
		</div>
	</div>
</div>

<script lang="ts">

	let hostaddress = '';
	let apikey = '';

	let modalmsg = '';
	let modaldesc = '';

	window.api.getUserData().then((data) => {
		if(data && data.settings){
			hostaddress = data.settings.apiAddress || '';
			apikey = data.settings.apiKey || '';
		}
	}).catch((err) => {
		console.error('Error getting user data:', err);
	});

	function openDTG() {
		window.api.openExternalLink('https://forums.dovetailgames.com/threads/train-sim-world-api-support.94488/');
		return true;
	}

	async function saveSettings() {
		console.log('Settings saved:', { hostaddress, apikey });
		await window.api.saveSettings(hostaddress, apikey);

		modalmsg = 'Success!';
		modaldesc = `Settings saved:\nAPI Address: ${hostaddress}\nAPI Key: ${apikey}`;

		const modal = document.getElementById('success_modal') as HTMLDialogElement | null;
		if (modal) {
			modal.showModal();
		}
	}
</script>