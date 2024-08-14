<script>
	import { goto } from '$app/navigation';

	import { german_words } from '$lib/german_words.js';

	let team_count = 2;
	let player_count = 4;

	let teams = [
		{
			id: 1,
			name: 'Team 1',
			players: ['Player 1', 'Player 2'],
			points: 0,
			round: 0,
			current_player_id: 0,
		},
		{
			id: 2,
			name: 'Team 2',
			players: ['Player 3', 'Player 4'],
			points: 0,
			round: 0,
			current_player_id: 0,
		},
	];


	function add_player(team_index) {
		++player_count;
		teams[team_index].players.push(`Player ${player_count}`);
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
		};

		// Write teams to store
		localStorage.setItem("game_state", JSON.stringify(game_state));

		// Navigate to /play
		goto('/play');

	}

</script>

<svelte:head>
	<title>30Seconds</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>


	<div>Create teams</div>

	<div class="pt-20 text-2xl space-y-5">
		{#each teams as team, team_index}
		<div>
			<div>Team {team.id}</div>

			<div class="">
				{#each team.players as player}
					<input type="text" value={player}>
				{/each}
			</div>

			<div>
				<button on:click={() => add_player(team_index)}>Add player</button>
			</div>
		</div>
		{/each}

		<div>
			<button on:click={() => add_team()}>Add team</button>
		</div>
	</div>

	<div>
		<button on:click={() => ready()}>Ready</button>
	</div>



</section>

