<script lang="ts">
	import VideoPlayer from '$lib/components/VideoPlayer.svelte'
	import type { PageData } from './$types'
	import CommentForm from './CommentForm.svelte'

	const { data }: { data: PageData } = $props()

	let showFullDescription = $state(false)
	const MAX_DESCRIPTION_LENGTH = 150
</script>

<svelte:head>
	<title>{data.video.name} | Zapple Play</title>
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
					{#key data.video}
						<CommentForm {data} videoAssetId={data.video.id} />
					{/key}

					<h2 class="comments-title">Komentar ({data.video.comments?.length || 0})</h2>

					<div class="comment-list">
						{#each data.video.comments || [] as comment}
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
											{new Date(comment.cretedAt).toLocaleString('id-ID', {
												day: 'numeric',
												month: 'long',
												year: 'numeric'
											})}
										</span>
									</div>
									<p class="comment-text">{comment.comment}</p>
								</div>
							</div>
						{/each}
					</div>
				</section>
			</div>

			<aside class="sidebar">
				<h3 class="sidebar-title">Video Lainnya</h3>
				<div class="video-list">
					{#each data.otherVideos as video}
						<a href={`?id=${video.id}`} class="video-item">
							<img src={video.thumbnail} alt={video.name} class="video-thumbnail" />
							<div class="video-details">
								<h4 class="video-item-title">{video.name}</h4>
								<span class="video-views">{video.views.toLocaleString()} x ditonton</span>
							</div>
						</a>
					{/each}
				</div>
			</aside>
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

	.sidebar {
		width: 100%;
		max-width: 320px;
		flex-shrink: 0;
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

	.sidebar-title {
		font-size: clamp(1rem, 3vw, 1.2rem);
		color: #ffffff;
		margin-bottom: 12px;
		padding-bottom: 8px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.video-list {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.video-item {
		display: flex;
		gap: 8px;
		text-decoration: none;
		color: inherit;
		padding: 6px;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	.video-item:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}

	.video-thumbnail {
		width: 100px;
		height: 56px;
		border-radius: 4px;
		object-fit: cover;
		flex-shrink: 0;
	}

	.video-details {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-width: 0;
	}

	.video-item-title {
		font-size: clamp(0.85rem, 2.5vw, 0.95rem);
		font-weight: 500;
		color: #ffffff;
		margin: 0 0 4px 0;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.video-views {
		font-size: clamp(0.75rem, 2vw, 0.8rem);
		color: #aaaaaa;
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
		gap: 6px;
		margin-bottom: 4px;
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

	@media (max-width: 1024px) {
		.content-wrapper {
			flex-direction: column;
		}

		.sidebar {
			max-width: 100%;
			margin-top: 24px;
		}

		.video-list {
			flex-direction: row;
			flex-wrap: wrap;
			gap: 12px;
		}

		.video-item {
			width: calc(50% - 6px);
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

		.video-item {
			width: 100%;
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

		.video-thumbnail {
			width: 80px;
			height: 45px;
		}
	}
</style>
