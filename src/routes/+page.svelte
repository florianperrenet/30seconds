<script>
	import { goto } from '$app/navigation';

	import { german_words } from '$lib/german_words.js';



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



	import { onMount } from 'svelte';


	onMount(() => {
		let game_state = JSON.parse(localStorage.getItem("game_state"));
		if (game_state !== null) {
			teams = game_state.teams;
			for (let team of teams) {
				team.points = 0;
				team.round = 0;
				team.current_player_id = 0;
			}
		}
	});



	function add_player(team_index) {
		++player_count;
		teams[team_index].players.push(`Player${player_count}`);
		teams = teams;
	}

	function add_team(team_index) {
		++team_count;
		teams.push({
			id: team_count,
			name: `Team ${team_count}`,
			players: [],
			round: 0,
			points: 0,
			current_player_id: 0,
		});

		add_player(team_count - 1);
		add_player(team_count - 1);

		teams = teams;
	}

	function ready() {
		const game_state = {
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
		};

		// Write teams to store
		localStorage.setItem("game_state", JSON.stringify(game_state));

		// Navigate to /play
		goto('play');

	}


	function reset_game_state() {
		localStorage.removeItem("game_state");
	}

</script>

<svelte:head>
	<title>30Seconds</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section class="py-10">
	<div class="max-w-md mx-auto px-4">


	<div class="text-3xl text-center text-white font-semibold mb-4">Create teams</div>

	{#each teams as team, team_index}
	<div class="border-b py-5">
		<div class="text-white text-xl font-semibold">Team {team.id}</div>

		<div class="">
			{#each team.players as player}
				<div class="mt-3">
					<input type="text" bind:value={player} class="py-3 px-4 block w-full shadow-sm border border-gray-200 text-gray-900 rounded-md">
				</div>
			{/each}
		</div>

		<div>
			<button on:click={() => add_player(team_index)} class="mt-3 py-2 font-medium text-lg bg-gray-200 w-full shadow-button rounded-md active:shadow-none text-sm">Add player</button>
		</div>
	</div>
	{/each}


	<div class="">
		<button on:click={() => add_team()} class="mt-5 py-3 text-white font-medium text-lg px-3 bg-sky-500 w-full shadow-button rounded-md active:shadow-none text-sm">Add team</button>
	</div>

	<div class="mt-5">
		<button on:click={() => ready()} class="py-3 text-white font-medium text-lg px-3 bg-sky-600 w-full shadow-button rounded-md active:shadow-none">Ready!</button>
	</div>


	<div class="text-center mt-10">
		<button on:click={() => reset_game_state()} class="text-white text-sm">Reset game state</button>
	</div>


	</div>
</section>

