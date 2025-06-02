<script lang="ts">
	import { enhance } from '$app/forms'
	import VideoPlayer from '$lib/components/VideoPlayer.svelte'
	import { TrashIcon } from 'lucide-svelte'
	import type { PageData } from './$types'

	let { data }: { data: PageData } = $props()
	let showFullDescription = $state(false)
	const MAX_DESCRIPTION_LENGTH = 150
</script>

<svelte:head>
	<title>{data.video.name} Preview | Zapple Play</title>
</svelte:head>

<div class="video-page">
	{#if !data.video}
		<p>Video tidak ditemukan</p>
	{:else}
		<div class="content-wrapper">
			<div class="main-content">
				<section class="video-container">
					{#key data.video}
						<VideoPlayer video={data.video} />
					{/key}
				</section>

				<section class="video-info">
					<h1 class="video-title">{data.video.name}</h1>

					<div class="video-meta">
						<span class="views">{data.video.views.toLocaleString()} x ditonton</span>
						<span class="separator">•</span>
						<span class="upload-date">
							{Intl.DateTimeFormat('en-EN', { dateStyle: 'long', timeStyle: 'short' }).format(
								data.video.createdAt
							)}
						</span>
					</div>

					{#if data.video.description}
						<div class="description">
							{#if showFullDescription || data.video.description.length <= MAX_DESCRIPTION_LENGTH}
								<p>{data.video.description}</p>
							{:else}
								<p>{data.video.description.slice(0, MAX_DESCRIPTION_LENGTH)}...</p>
							{/if}

							{#if data.video.description.length > MAX_DESCRIPTION_LENGTH}
								<button
									class="show-more-btn"
									onclick={() => (showFullDescription = !showFullDescription)}
								>
									{showFullDescription ? 'Tampilkan Lebih Sedikit' : 'Lihat Selengkapnya'}
								</button>
							{/if}
						</div>
					{/if}
				</section>

				<section class="comments-section">
					<h2 class="comments-title">Komentar ({data.video.comments?.length || 0})</h2>

					<div class="comment-list">
						{#each data.video.comments as comment}
							<div class="comment">
								<img
									class="comment-avatar"
									src={comment.User?.imageUrl || 'https://i.pravatar.cc/150'}
									alt={comment.User?.username || 'Unknown'}
								/>
								<div class="comment-content">
									<div class="comment-header">
										<span class="comment-user">{comment.User?.username || 'Unknown'}</span>
										<span class="comment-time">
											{Intl.DateTimeFormat('en-EN', {
												dateStyle: 'long'
											}).format(comment.cretedAt)}
										</span>
										<form method="post" use:enhance class="delete-form">
											<input type="hidden" name="id" value={comment.id} />
											<button type="submit" class="delete-btn" title="Hapus Komentar">
												<TrashIcon size={16} />
											</button>
										</form>
									</div>
									<p class="comment-text">{comment.comment}</p>
								</div>
							</div>
						{/each}
					</div>
				</section>
			</div>
		</div>
	{/if}
</div>

<style>
	.video-page {
		max-width: 1400px;
		margin: 0 auto;
		padding: 16px;
		color: #ffffff;
	}

	.content-wrapper {
		display: flex;
		gap: 16px;
	}

	.main-content {
		flex: 1;
		min-width: 0;
	}

	.video-container {
		background: #000;
		border-radius: 8px;
		overflow: hidden;
		aspect-ratio: 16/9;
	}

	.video-info {
		margin-top: 16px;
		padding: 0 8px;
	}

	.video-title {
		font-size: clamp(1.2rem, 4vw, 1.6rem);
		font-weight: 700;
		color: #ffffff;
		margin: 12px 0 8px;
		line-height: 1.3;
	}

	.video-meta {
		display: flex;
		align-items: center;
		gap: 6px;
		color: #aaaaaa;
		font-size: clamp(0.8rem, 2.5vw, 0.9rem);
		margin-bottom: 12px;
	}

	.separator {
		font-size: 0.6rem;
	}

	.description {
		margin: 16px 0;
	}

	.description p {
		font-size: clamp(0.9rem, 3vw, 1rem);
		font-weight: 500;
		color: #e0e0e0;
		line-height: 1.6;
		margin-bottom: 8px;
	}

	.show-more-btn {
		background: none;
		border: none;
		color: #aaaaaa;
		font-size: clamp(0.8rem, 2.5vw, 0.9rem);
		cursor: pointer;
		padding: 0;
		font-weight: 600;
		margin-top: 8px;
	}

	.show-more-btn:hover {
		color: #ffffff;
	}

	.comments-section {
		margin-top: 24px;
		padding: 0 8px;
	}

	.comments-title {
		font-size: clamp(1.1rem, 3vw, 1.3rem);
		color: #ffffff;
		margin-bottom: 16px;
		font-weight: 600;
	}

	.comment-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 20px;
	}

	.comment {
		display: flex;
		gap: 10px;
	}

	.comment-avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		object-fit: cover;
	}

	.comment-content {
		flex: 1;
	}

	.comment-header {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 4px;
		position: relative;
	}

	.comment-user {
		font-weight: 600;
		color: #ffffff;
		font-size: clamp(0.85rem, 2.5vw, 0.95rem);
	}

	.comment-time {
		color: #aaaaaa;
		font-size: clamp(0.75rem, 2vw, 0.8rem);
	}

	.comment-text {
		color: #e0e0e0;
		font-size: clamp(0.8rem, 2.5vw, 0.9rem);
		line-height: 1.5;
		margin-bottom: 8px;
	}

	.delete-form {
		margin-left: 12px;
	}

	.delete-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #2a2a2a;
		border: 1px solid #444;
		border-radius: 4px;
		padding: 4px;
		cursor: pointer;
		transition:
			background-color 0.2s,
			transform 0.1s;
	}

	.delete-btn:hover {
		background-color: #ff4d4d;
		transform: scale(1.05);
	}

	.delete-btn:active {
		transform: scale(0.95);
	}

	@media (max-width: 1024px) {
		.content-wrapper {
			flex-direction: column;
		}
	}

	@media (max-width: 768px) {
		.video-page {
			padding: 12px;
		}

		.content-wrapper {
			gap: 12px;
		}

		.video-info {
			margin-top: 12px;
			padding: 0 4px;
		}

		.video-meta {
			gap: 4px;
		}

		.description {
			margin: 12px 0;
		}

		.comments-section {
			margin-top: 20px;
			padding: 0 4px;
		}

		.comment-list {
			gap: 10px;
			margin-bottom: 16px;
		}

		.comment {
			gap: 8px;
		}

		.delete-form {
			margin-left: 8px;
		}

		.delete-btn {
			padding: 3px;
		}
	}

	@media (max-width: 640px) {
		.video-page {
			padding: 8px;
		}

		.video-info {
			margin-top: 8px;
		}

		.video-meta {
			flex-wrap: wrap;
		}

		.comments-section {
			margin-top: 16px;
		}

		.comment-avatar {
			width: 28px;
			height: 28px;
		}

		.delete-form {
			margin-left: 6px;
		}

		.delete-btn {
			padding: 2px;
		}
	}
</style>
