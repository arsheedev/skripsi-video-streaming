<script lang="ts">
	import { browser } from '$app/environment'
	import VideoPlayer from '$lib/components/VideoPlayer.svelte'
	import { getUser } from '$lib/utils'
	import type { ActionData, PageData } from './$types'
	import CommentForm from './CommentForm.svelte'

	interface UserInterface {
		name: string
		username: string
		imageUrl: string
	}

	export let data: PageData
	export let form: ActionData

	let user: UserInterface = { name: '', username: '', imageUrl: '' }

	if (browser) {
		const temp = localStorage.getItem('user')

		if (!temp) {
			getUser().then((data) => {
				localStorage.setItem('user', JSON.stringify(data))
				user = data
			})
		} else {
			user = JSON.parse(temp)
		}
	}

	if (data.video) {
		data.form.data.name = form?.name || user.name
		data.form.data.username = form?.username || user.username
		data.form.data.imageUrl = form?.imageUrl || user.imageUrl
		data.form.data.videoAssetId = data.video.id
	}

	let showFullDescription = false
	const MAX_DESCRIPTION_LENGTH = 150
</script>

<div class="video-page">
	{#if !data.video}
		<p>Video tidak ditemukan</p>
		<pre>{JSON.stringify(data, null, 2)}</pre>
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
						<span class="upload-date"
							>{Intl.DateTimeFormat('id', { dateStyle: 'long', timeStyle: 'long' }).format(
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
									on:click={() => (showFullDescription = !showFullDescription)}
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
												year: 'numeric',
												hour: '2-digit',
												minute: '2-digit'
											})}
										</span>
									</div>
									<p class="comment-text">{comment.comment}</p>
									<!-- <div class="comment-actions">
										<button class="reply-btn">Balas</button>
									</div> -->
								</div>
							</div>
						{/each}
					</div>

					{#if browser}
						<CommentForm {data} {user} videoAssetId={data.video.id} />
					{/if}
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
		padding: 20px;
		color: #ffffff;
	}

	.content-wrapper {
		display: flex;
		gap: 24px;
	}

	.main-content {
		flex: 1;
		min-width: 0;
	}

	.sidebar {
		width: 320px;
		flex-shrink: 0;
	}

	.video-container {
		background: #000;
		border-radius: 8px;
		overflow: hidden;
		aspect-ratio: 16/9;
	}

	.video-info {
		margin-top: 20px;
		padding: 0 8px;
	}

	.video-title {
		font-size: 1.8rem;
		font-weight: 700;
		color: #ffffff;
		margin: 16px 0 8px;
		line-height: 1.3;
	}

	.video-meta {
		display: flex;
		align-items: center;
		gap: 8px;
		color: #aaaaaa;
		font-size: 0.9rem;
		margin-bottom: 16px;
	}

	.separator {
		font-size: 0.6rem;
	}

	.description {
		margin: 20px 0;
	}

	.description p {
		font-size: 1.1rem;
		font-weight: 500;
		color: #e0e0e0;
		line-height: 1.6;
		margin-bottom: 8px;
	}

	.show-more-btn {
		background: none;
		border: none;
		color: #aaaaaa;
		font-size: 0.9rem;
		cursor: pointer;
		padding: 0;
		font-weight: 600;
		margin-top: 8px;
	}

	.show-more-btn:hover {
		color: #ffffff;
	}

	.sidebar-title {
		font-size: 1.2rem;
		color: #ffffff;
		margin-bottom: 16px;
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
		padding: 8px;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	.video-item:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}

	.video-thumbnail {
		width: 120px;
		height: 68px;
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
		font-size: 0.95rem;
		font-weight: 500;
		color: #ffffff;
		margin: 0 0 4px 0;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.video-views {
		font-size: 0.8rem;
		color: #aaaaaa;
	}

	.comments-section {
		margin-top: 32px;
		padding: 0 8px;
	}

	.comments-title {
		font-size: 1.4rem;
		color: #ffffff;
		margin-bottom: 20px;
		font-weight: 600;
	}

	.comment-list {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-bottom: 24px;
	}

	.comment {
		display: flex;
		gap: 12px;
	}

	.comment-avatar {
		width: 40px;
		height: 40px;
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
	}

	.comment-user {
		font-weight: 600;
		color: #ffffff;
		font-size: 0.95rem;
	}

	.comment-time {
		color: #aaaaaa;
		font-size: 0.8rem;
	}

	.comment-text {
		color: #e0e0e0;
		font-size: 0.9rem;
		line-height: 1.5;
		margin-bottom: 8px;
	}

	.comment-actions {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.like-btn,
	.reply-btn {
		background: none;
		border: none;
		color: #aaaaaa;
		font-size: 0.85rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 0;
	}

	.like-btn:hover,
	.reply-btn:hover {
		color: #ffffff;
	}

	.like-btn svg {
		color: #aaaaaa;
	}

	.like-btn:hover svg {
		color: #ff0000;
	}

	@media (max-width: 1024px) {
		.content-wrapper {
			flex-direction: column;
		}

		.sidebar {
			width: 100%;
			margin-top: 32px;
		}

		.video-list {
			flex-direction: row;
			flex-wrap: wrap;
		}

		.video-item {
			width: calc(50% - 6px);
		}
	}

	@media (max-width: 768px) {
		.video-title {
			font-size: 1.5rem;
		}

		.description p {
			font-size: 1rem;
		}

		.video-item {
			width: 100%;
		}

		.comments-title {
			font-size: 1.2rem;
		}
	}
</style>
