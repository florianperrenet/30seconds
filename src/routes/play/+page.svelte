<script>
	import { german_words } from '$lib/german_words.js';
	import { onMount } from 'svelte';

	let game_state = null;
	let audio = null;


	onMount(() => {
		game_state = JSON.parse(localStorage.getItem("game_state"));
		audio = new Audio('/30seconds/alarm-clock-sound.m4a');
	});


	let guess_state = null;



	function getRandomItem(array) {
		return array[Math.floor(Math.random() * array.length)];
	}

	let random_words = [];



	function set_random_words() {
		random_words = [
			getRandomItem(german_words),
			getRandomItem(german_words),
			getRandomItem(german_words),
			getRandomItem(german_words),
			getRandomItem(german_words),
		];
	}

	set_random_words();


	// let current_player = 'Player 1';
	// let next_player = 'Player 2';

	// let is_player_ready = false;
	// let time_is_up = false;
	// let select_correct_words = false;
	// let pass_it_to_next_player = false;

	// let progress_percentage = 0;

	// let selected_words = [false, false, false, false, false];


	const match_duration = 30;


	function player_is_done() {
		game_state.time_is_up = true;

		audio.play();

		save_game_state();
	}




	function check_guess_state() {
		let time_elapsed = (new Date() - guess_state.start_time) / 1000;

		game_state.progress_percentage = Math.min(time_elapsed / match_duration * 100, 100);

		if (time_elapsed >= match_duration) {
			player_is_done();
		} else {
			setTimeout(check_guess_state, 1000);
		}
	}


	function player_is_ready() {
		game_state.is_player_ready = true;

		let start_time = new Date();

		guess_state = {
			start_time,
		};

		setTimeout(check_guess_state, 1000);
	}

	// player_is_ready();
	// player_is_done();
	// select_correct_words = true;
	// pass_it_to_next_player = true;

	function phone_is_passed() {
		game_state.is_player_ready = false;
		game_state.time_is_up = false;
		game_state.select_correct_words = false;
		game_state.pass_it_to_next_player = false;
		game_state.selected_words = [false, false, false, false, false];
		game_state.progress_percentage = 0;

		set_random_words();

		save_game_state();
	}


	function set_next_player() {
		let new_team_id = game_state.current_team_id + 1;


		if (new_team_id > game_state.teams.length - 1) {
			new_team_id -= game_state.teams.length;
		}


		// console.log(new_team_id);

		let new_team = game_state.teams[new_team_id];


		let new_player_id = game_state.current_team.current_player_id + 1;
		if (new_player_id > game_state.current_team.players.length - 1)
			new_player_id -= game_state.current_team.players.length;

		game_state.teams[game_state.current_team_id].current_player_id = new_player_id;
		game_state.teams[game_state.current_team_id].round += 1;

		game_state.current_team = new_team;
		game_state.current_team_id = new_team_id;

		// console.log(new_team);
		game_state.current_player = new_team.players[new_team.current_player_id];

		save_game_state();
	}

	function save_game_state() {
		localStorage.setItem("game_state", JSON.stringify(game_state));
	}

	function correct_words_selected() {
		game_state.pass_it_to_next_player = true;

		// Update game state score and round if applicable.
		let correct_count = 0;
		for (const item of game_state.selected_words) {
			if (item === true) {
				++correct_count;
			}
		}

		game_state.teams[game_state.current_team_id].points += correct_count;

		set_next_player();

		save_game_state();
	}
</script>

<svelte:head>
	<title>30Seconds</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="relative">
		

	{#if !(game_state === null)}

	{#if game_state.time_is_up}
		{#if game_state.select_correct_words}
			{#if game_state.pass_it_to_next_player}
				<div class="max-w-md px-5 py-20">
					<div class="text-3xl text-center text-white font-semibold mt-5">Pass it on to {game_state.current_player}</div>

					<div class="max-w-md mx-auto mt-10">
						<button on:click={() => phone_is_passed()} class="py-3 text-white font-medium text-lg px-3 bg-sky-600 w-full shadow-button rounded-md active:shadow-none">Next</button>
					</div>

					<div class="mt-20 max-w-md mx-auto bg-white p-5 rounded-md">
						<div class="text-center text-lg font-medium">The score</div>
						<div class="mt-5">
							<table class="w-full">
								<thead>
									<th class="py-2"></th>
									<th class="py-2 font-medium text-sm">Round</th>
									<th class="py-2 font-medium text-sm">Points</th>
								</thead>
								<tbody class="text-lg">
									{#each game_state.teams as team, team_index}
									<tr>
										<td class="border-y py-2 font-semibold">{team.name}</td>
										<td class="border-y py-2 text-center">{team.round}</td>
										<td class="border-y py-2 text-center">{team.points}</td>
									</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			{:else}

			<div class="fixed text-white text-center w-full text-2xl pt-5">
				<div class="grid grid-cols-3 flex items-center">
					<div></div>
					<div>{game_state.current_team.name}</div>
					<a class="ml-auto pr-5" href="/30seconds">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
						  <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
						  <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
						</svg>
					</a>
				</div>
			</div>


			<div class="h-screen mx-5 flex justify-center items-center">
				<div class="w-full">
					<div class="mx-auto text-2xl bg-white space-y-6 max-w-md text-center border border-2 rounded-md py-8 w-full px-5">
						{#each random_words as word, word_index}
						<div class="flex items-center">
							<input id={`checkbox-word-select-${word_index}`} type="checkbox" bind:checked={game_state.selected_words[word_index]} class="w-5 h-5 bg-gray-100 border-gray-300 rounded">
							<label for={`checkbox-word-select-${word_index}`} class="ml-3">{word}</label>
						</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="absolute bottom-0 left-0 w-full">
				<div class="m-10 mx-5">
					<button on:click={() => correct_words_selected()} class="py-3 text-white font-medium text-lg px-3 bg-sky-600 w-full shadow-button rounded-md active:shadow-none">Next</button>
				</div>
			</div>
			{/if}
		{:else}
		<div class="fixed text-white text-center w-full text-2xl pt-5">
			<div class="grid grid-cols-3 flex items-center">
				<div></div>
				<div>{game_state.current_team.name}</div>
				<a class="ml-auto pr-5" href="/30seconds">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
					  <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
					  <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
					</svg>
				</a>
			</div>
		</div>

		<div class="h-screen flex justify-center items-center text-white">
			<div class="text-center">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-32 h-32 mx-auto">
				  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
				</svg>

				<div class="text-4xl text-center font-semibold mt-5">Your time is up!</div>
			</div>
		</div>

		<div class="absolute bottom-0 left-0 w-full">
			<div class="my-10 mx-5">
				<button on:click={() => (game_state.select_correct_words = true)} class="py-3 text-white font-medium text-lg px-3 bg-sky-600 w-full shadow-button rounded-md active:shadow-none">Next</button>
			</div>
		</div>
		{/if}


	{:else}
		{#if game_state.is_player_ready}
		<div class="absolute top-0 left-0 w-full">
			<div class={`${game_state.progress_percentage > 70 ? 'bg-orange-500' : 'bg-sky-600'} h-3`} style={`width: ${game_state.progress_percentage}%;`}></div>
		</div>

		<div class="mx-5 relative h-screen flex justify-center items-center">
			<div class="w-full">
				<div class="mx-auto bg-white text-2xl space-y-6 max-w-md text-center border border-2 rounded-md py-8 w-full">
					{#each random_words as word}
					<div>{word}</div>
					{/each}
				</div>
			</div>
		</div>

		{:else}

		<div>
			<div class="fixed text-white text-center w-full text-2xl pt-5">
				<div class="grid grid-cols-3 flex items-center">
					<div></div>
					<div>{game_state.current_team.name}</div>
					<a class="ml-auto pr-5" href="/30seconds">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
						  <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
						  <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
						</svg>
					</a>
				</div>
			</div>

			<div class="h-screen flex items-center justify-center">
				<div class="w-full px-5">
					<div class="text-4xl text-center text-white font-semibold">{game_state.current_player},<br/> are you ready?</div>
					<button on:click={() => player_is_ready()} class="mt-10 py-3 text-white font-medium text-lg px-3 bg-sky-600 w-full shadow-button rounded-md active:shadow-none">Next</button>
				</div>
			</div>
		</div>

		{/if}
	{/if}




	{/if}



</section>

