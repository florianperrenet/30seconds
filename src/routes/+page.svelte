<script>
	import { goto } from '$app/navigation';
    import { base } from '$app/paths';
	import { onMount } from 'svelte';

	import { german_words } from '$lib/german_words.js';
	import { dutch_words } from '$lib/dutch_words.js';

	let selected_language = 'dutch';

	let team_count = 2;
	let player_count = 4;

	let teams = [
		{
			id: 1,
			name: 'Team 1',
			players: ['Player1', 'Player2'],
			points: 0,
			round: 0,
			current_player_id: 0,
		},
		{
			id: 2,
			name: 'Team 2',
			players: ['Player3', 'Player4'],
			points: 0,
			round: 0,
			current_player_id: 0,
		},
	];

	let game_state = {
		teams,

		current_team_id: 0,
		current_team: teams[0],

		current_player: teams[0].players[0],

		is_player_ready: false,
		time_is_up: false,
		select_correct_words: false,
		pass_it_to_next_player: false,
		progress_percentage: 0,
		selected_words: [false, false, false, false, false],
		language: 'dutch',
	};

	onMount(() => {
		const saved_game_state = JSON.parse(localStorage.getItem("game_state"));
		if (saved_game_state !== null) {
			game_state.teams = saved_game_state.teams;
			team_count = game_state.teams.length;
			for (let team of game_state.teams) {
				team.points = 0;
				team.round = 0;
				team.current_player_id = 0;
			}
			if (saved_game_state.language) {
				selected_language = saved_game_state.language;
				game_state.language = saved_game_state.language;
			}
		}
	});

	function on_language_change() {
		game_state.language = selected_language;
		save_game_state();
	}

	function add_player(team_index) {
		++player_count;
		game_state.teams[team_index].players.push(`Player${player_count}`);

		game_state = game_state;

		save_game_state();
	}

	function remove_player(team_index, player_index) {
		--player_count;
		game_state.teams[team_index].players.splice(player_index, 1);
		game_state = game_state;

		save_game_state();
	}

	function add_team(team_index) {
		++team_count;
		game_state.teams.push({
			id: team_count,
			name: `Team ${team_count}`,
			players: [],
			round: 0,
			points: 0,
			current_player_id: 0,
		});

		add_player(team_count - 1);
		add_player(team_count - 1);

		game_state = game_state;

		save_game_state();
	}

	function remove_team(team_index) {
		--team_count;
		game_state.teams.splice(team_index, 1);
		game_state.teams = game_state.teams;
		save_game_state();
	}

	function save_game_state() {
		// Write teams to store
		localStorage.setItem("game_state", JSON.stringify(game_state));
	}

	function ready() {
    game_state.current_player = game_state.teams[0].players[0];
		save_game_state();

		// Navigate to /play
		goto(base+'/play');
	}


	function reset_game_state() {
		localStorage.removeItem("game_state");
		location.reload();
	}

</script>

<svelte:head>
	<title>30Seconds</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="py-10">
	<div class="max-w-md mx-auto px-4">


	<div class="text-4xl text-center text-white font-semibold mb-4">Create teams</div>

	<div class="mb-4 rounded-md overflow-hidden">
		<select bind:value={selected_language} on:change={on_language_change} class="py-3 px-4 block w-full text-gray-900 bg-white">
			<option value="dutch">Dutch</option>
			<option value="german">German</option>
		</select>
	</div>

	{#each game_state.teams as team, team_index}
	<div class="border-b py-5">
		<div class="text-white text-xl font-semibold flex items-center justify-between">Team {team.id}

			{#if team_index > 1}
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 ml-2 cursor-pointer text-gray-200" on:click={() => remove_team(team_index)}>
			  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
			</svg>
			{/if}
</div>

		<div class="mt-3 divide-y rounded-md overflow-hidden">
			{#each team.players as player, player_index}
				<div class="flex items-center bg-white">
					<input type="text" bind:value={player} class="py-3 px-4 block w-full text-gray-900">
					{#if player_index > 1}
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2 cursor-pointer text-gray-500" on:click={() => remove_player(team_index, player_index)}>
					  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
					</svg>
					{/if}
				</div>
			{/each}
		</div>

		<div>
			<button on:click={() => add_player(team_index)} class="mt-3 py-2 font-medium text-lg bg-gray-200 w-full shadow-button rounded-md active:shadow-none text-sm select-none">Add player</button>
		</div>
	</div>
	{/each}


	<div class="">
		<button on:click={() => add_team()} class="mt-5 py-3 text-white font-medium text-lg px-3 bg-sky-500 w-full shadow-button rounded-md active:shadow-none text-sm select-none">Add team</button>
	</div>

	<div class="mt-5">
		<button on:click={() => ready()} class="py-3 text-white font-medium text-lg px-3 bg-sky-600 w-full shadow-button rounded-md active:shadow-none select-none">Ready!</button>
	</div>


	<div class="text-center mt-10">
		<button on:click={() => reset_game_state()} class="text-white text-sm select-none">Reset game state</button>
	</div>


	</div>
</section>

