<script>
	import { german_words } from '$lib/german_words.js';
	import { onMount } from 'svelte';

	let game_state = null;

	onMount(() => {
		game_state = JSON.parse(localStorage.getItem("game_state"));
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

	let is_player_ready = false;
	let time_is_up = false;
	let select_correct_words = false;
	let pass_it_to_next_player = false;


	const match_duration = 30;


	function player_is_done() {
		time_is_up = true;
	}


	let progress_percentage = 0;

	let selected_words = [false, false, false, false, false];



	function check_guess_state() {
		let time_elapsed = (new Date() - guess_state.start_time) / 1000;

		progress_percentage = Math.min(time_elapsed / match_duration * 100, 100);

		if (time_elapsed >= match_duration) {
			player_is_done();
		} else {
			setTimeout(check_guess_state, 1000);
		}
	}


	function player_is_ready() {
		is_player_ready = true;

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
		is_player_ready = false;
		time_is_up = false;
		select_correct_words = false;
		pass_it_to_next_player = false;

		selected_words = [false, false, false, false, false];
		progress_percentage = 0;

		set_random_words();
	}


	function set_next_player() {
		let new_team_id = game_state.current_team_id + 1;


		if (new_team_id > game_state.teams.length - 1) {
			new_team_id -= game_state.teams.length;
		}


		console.log(new_team_id);

		let new_team = game_state.teams[new_team_id];


		let new_player_id = game_state.current_team.current_player_id + 1;
		if (new_player_id > game_state.current_team.players.length - 1)
			new_player_id -= game_state.current_team.players.length;

		game_state.teams[game_state.current_team_id].current_player_id = new_player_id;
		game_state.teams[game_state.current_team_id].round += 1;

		game_state.current_team = new_team;
		game_state.current_team_id = new_team_id;

		console.log(new_team);
		game_state.current_player = new_team.players[new_team.current_player_id];
	}

	function correct_words_selected() {
		pass_it_to_next_player = true;

		// Update game state score and round if applicable.
		let correct_count = 0;
		for (const item of selected_words) {
			if (item === true) {
				++correct_count;
			}
		}

		game_state.teams[game_state.current_team_id].points += correct_count;
		localStorage.setItem("game_state", JSON.stringify(game_state));

		set_next_player();
	}
</script>

<svelte:head>
	<title>30Seconds</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="relative">

	{#if !(game_state === null)}

	{#if time_is_up}
		{#if select_correct_words}
			{#if pass_it_to_next_player}
				<div>
					<div class="mt-20 text-3xl text-center font-semibold mt-5">Pass it on to {game_state.current_player}</div>

					<div class="max-w-md mx-auto">
						<button on:click={() => phone_is_passed()} class="mt-10 py-3 text-white font-medium text-lg px-3 bg-blue-500 w-full">Next</button>
					</div>

					<div class="mt-10 max-w-md mx-auto">
						<div class="text-center text-lg">The score</div>
						<div class="mt-5">
							<table class="w-full">
								<thead>
									<th></th>
									<th class="font-medium text-sm">Round</th>
									<th class="font-medium text-sm">Points</th>
								</thead>
								<tbody class="text-lg">
									{#each game_state.teams as team, team_index}
									<tr>
										<td class="font-semibold">{team.name}</td>
										<td class="text-center">{team.round}</td>
										<td class="text-center">{team.points}</td>
									</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			{:else}

			<div class="fixed text-center w-full text-2xl pt-5">{game_state.current_team.name}</div>

			<div class="h-screen flex justify-center items-center">
				<div class="w-full">
					<div class="mx-auto text-2xl space-y-5 max-w-sm text-center border border-2 rounded-md py-10 w-full mx-5 px-5">
						{#each random_words as word, word_index}
						<div class="flex items-center">
							<input id={`checkbox-word-select-${word_index}`} type="checkbox" bind:checked={selected_words[word_index]}>
							<label for={`checkbox-word-select-${word_index}`} class="ml-3">{word}</label>
						</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="absolute bottom-0 left-0 w-full">
				<div class="m-10">
					<button on:click={() => correct_words_selected()} class="py-3 text-white font-medium text-lg px-3 bg-blue-500 w-full">Next</button>
				</div>
			</div>
			{/if}
		{:else}
		<div class="fixed text-center w-full text-2xl pt-5">{game_state.current_team.name}</div>

		<div class="h-screen flex justify-center items-center">
			<div class="text-center">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-32 h-32 mx-auto">
				  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
				</svg>

				<div class="text-3xl text-center font-semibold mt-5">Your time is up!</div>
			</div>
		</div>

		<div class="absolute bottom-0 left-0 w-full">
			<div class="m-10">
				<button on:click={() => (select_correct_words = true)} class="py-3 text-white font-medium text-lg px-3 bg-blue-500 w-full">Next</button>
			</div>
		</div>
		{/if}


	{:else}
		{#if is_player_ready}

		<div class="relative h-screen flex justify-center items-center">
			<div class="w-full">
				<div class="mx-auto text-2xl space-y-5 max-w-sm text-center border border-2 rounded-md py-10 w-full mx-5">
					{#each random_words as word}
					<div>{word}</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="absolute bottom-0 left-0 w-full">
			<div class="bg-blue-500 h-5" style={`width: ${progress_percentage}%;`}></div>
		</div>
		{:else}

		<div class="">
			<div class="fixed text-center w-full text-2xl pt-5">{game_state.current_team.name}</div>

			<div class="h-screen flex items-center justify-center">
				<div class="w-full px-10">
					<div class="text-3xl text-center font-semibold">{game_state.current_player},<br/> are you ready?</div>
					<button on:click={() => player_is_ready()} class="mt-10 py-3 text-white font-medium text-lg px-3 bg-blue-500 w-full">Next</button>
				</div>
			</div>
		</div>

		{/if}
	{/if}




	{/if}



</section>

