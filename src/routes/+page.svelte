<script>
	import { german_words } from '$lib/german_words.js';

	function getRandomItem(array) {
		return array[Math.floor(Math.random() * array.length)];
	}

	let random_words = [
		getRandomItem(german_words),
		getRandomItem(german_words),
		getRandomItem(german_words),
		getRandomItem(german_words),
		getRandomItem(german_words),
	];
</script>

<svelte:head>
	<title>30Seconds</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>


	<div class="pt-20 text-2xl space-y-5 text-center">
		{#each random_words as word}
		<div>{word}</div>
		{/each}
	</div>



</section>

