<script lang="ts">
  import electronLogo from '$lib/assets/electron.svg';
  import svelteLogo from '$lib/assets/svelteKit.svg';
  import typescriptLogo from '$lib/assets/typescript.svg';
  import viteLogo from '$lib/assets/vite.svg';
  import tailwindcssLogo from '$lib/assets/tailwindcss.svg';
  import Counter from '$lib/Counter.svelte';
  import type { UserData } from '../../types/user-data'; // adjust path if needed

  let userData: UserData = {
    name: '',
    age: 0,
    email: '',
    settings: {
      theme: '',
      notifications: false,
    },
  };

  async function getUserData(): Promise<void> {
    try {
      userData = await window.api.getUserData();
	  console.log('User data loaded:', userData);
    } catch (err) {
      console.error('Error getting user data:', err);
    }
  }

  async function updateUserData(): Promise<void> {
    try {
      await window.api.updateUserData(userData);
    } catch (err) {
      console.error('Error updating user data:', err);
    }
  }

  getUserData();
</script>

<!-- Keep your pretty header section -->
<div class='max-w-7xl mx-auto px-16 py-20'>
	<div class='flex gap-16 flex-wrap justify-center *:shrink-0 *:transition *:duration-500 [&>*:hover]:duration-100'>
		<a id='vite' href='https://vitejs.dev' target="_blank" rel="noreferrer" class='hover:drop-shadow-[0_0_2em_#646cffaa]'>
			<img src={viteLogo} class='w-24 h-24' alt='Vite Logo' />
		</a>
		<a id='typescript' href='https://www.typescriptlang.org' target="_blank" rel="noreferrer" class='hover:drop-shadow-[0_0_2em_#3178c6aa]'>
			<img src={typescriptLogo} class='w-24 h-24' alt='Typescript Logo' />
		</a>
		<a id='electronForge' href='https://www.electronforge.io/' target="_blank" rel="noreferrer" class='hover:drop-shadow-[0_0_2em_#2f3242aa]'>
			<img src={electronLogo} class='w-24 h-24' alt='Electron Forge Logo' />
		</a>
		<a id='svelteKit' href='https://kit.svelte.dev/' target="_blank" rel="noreferrer" class='hover:drop-shadow-[0_0_2em_#ff3e00aa]'>
			<img src={svelteLogo} class='w-24 h-24' alt='Svelte Kit Logo' />
		</a>
		<a id='tailwind' href='https://tailwindcss.com/' target="_blank" rel="noreferrer" class='hover:drop-shadow-[0_0_2em_#19b5baaa]'>
			<img src={tailwindcssLogo} class='w-24 h-24' alt='Tailwind CSS Logo' />
		</a>
	</div>

	<h1 class='text-center text-4xl mt-12 mb-4'>User Data</h1>
	<div class="flex flex-col gap-4 max-w-md mx-auto">
		<label>
			Name:
			<input class="input input-bordered w-full" type="text" bind:value={userData.name} />
		</label>
		<label>
			Age:
			<input class="input input-bordered w-full" type="number" bind:value={userData.age} />
		</label>
		<label>
			Email:
			<input class="input input-bordered w-full" type="email" bind:value={userData.email} />
		</label>
		<button class="btn btn-primary mt-4" on:click={updateUserData}>Update</button>
	</div>

	<div class='m-auto w-fit mt-16'>
		<Counter />
	</div>
</div>
