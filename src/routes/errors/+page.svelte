<script lang="ts">
	type Props = {
		data: {
			error: string;
		};
	};

	let { data }: Props = $props();
</script>

<div class="min-h-screen hero md:-mt-20 lg:-mt-20">
	<div class="text-center hero-content">
		<div class="max-w-md">
			<h1 class="text-3xl font-bold">Sorry, there was an error!</h1>
			<p class="py-6">{data.error}</p>
		</div>
	</div>
</div>
