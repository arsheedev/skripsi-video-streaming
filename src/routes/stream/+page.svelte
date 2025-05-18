<script lang="ts">
	import VideoPlayer from '$lib/components/VideoPlayer.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	// Untuk fitur "lihat selengkapnya"
	let showFullDescription = false
	const MAX_DESCRIPTION_LENGTH = 150

	// Dummy data komentar
	const comments = [
		{
			id: 1,
			user: 'JohnDoe',
			avatar: 'https://i.pravatar.cc/150?img=1',
			text: 'Video yang sangat informatif! Saya suka penjelasannya yang detail.',
			time: '2 jam yang lalu',
			likes: 24
		},
		{
			id: 2,
			user: 'JaneSmith',
			avatar: 'https://i.pravatar.cc/150?img=2',
			text: 'Bagus banget kontennya, tunggu video berikutnya!',
			time: '5 jam yang lalu',
			likes: 15
		},
		{
			id: 3,
			user: 'TechEnthusiast',
			avatar: 'https://i.pravatar.cc/150?img=3',
			text: 'Bisa lebih dijelaskan tentang bagian teknisnya di video berikutnya?',
			time: '1 hari yang lalu',
			likes: 8
		},
		{
			id: 4,
			user: 'CreativeMind',
			avatar: 'https://i.pravatar.cc/150?img=4',
			text: 'Editingnya keren banget, apa software yang digunakan?',
			time: '1 hari yang lalu',
			likes: 12
		},
		{
			id: 5,
			user: 'NewViewer',
			avatar: 'https://i.pravatar.cc/150?img=5',
			text: 'Baru pertama kali nonton channel ini, langsung subscribe!',
			time: '2 hari yang lalu',
			likes: 5
		},
		{
			id: 6,
			user: 'CodeMaster',
			avatar: 'https://i.pravatar.cc/150?img=6',
			text: 'Teknik yang dijelasin sangat berguna untuk project saya, thanks!',
			time: '2 hari yang lalu',
			likes: 18
		},
		{
			id: 7,
			user: 'DesignLover',
			avatar: 'https://i.pravatar.cc/150?img=7',
			text: 'Warna grading videonya sangat pleasing di mata, good job!',
			time: '3 hari yang lalu',
			likes: 7
		},
		{
			id: 8,
			user: 'MovieBuff',
			avatar: 'https://i.pravatar.cc/150?img=8',
			text: 'Referensi yang diberikan sangat relevan dengan industri saat ini.',
			time: '3 hari yang lalu',
			likes: 9
		},
		{
			id: 9,
			user: 'GamerPro',
			avatar: 'https://i.pravatar.cc/150?img=9',
			text: 'Kualitas audio bisa ditingkatkan lagi di video berikutnya.',
			time: '4 hari yang lalu',
			likes: 3
		},
		{
			id: 10,
			user: 'Traveler',
			avatar: 'https://i.pravatar.cc/150?img=10',
			text: 'Kontennya sangat inspiratif, membuat saya ingin mencoba langsung!',
			time: '5 hari yang lalu',
			likes: 11
		}
	]
</script>

<div class="video-page">
	{#if !data.video}
		<p>Video tidak ditemukan</p>
		<pre>{JSON.stringify(data, null, 2)}</pre>
	{:else}
		<div class="content-wrapper">
			<!-- Main Content -->
			<div class="main-content">
				<!-- Video Player Full Section -->
				<section class="video-container">
					<VideoPlayer video={data.video} />
				</section>

				<!-- Video Info Section -->
				<section class="video-info">
					<h1 class="video-title">{data.video.name}</h1>

					<div class="video-meta">
						<span class="views">{data.video.views.toLocaleString()} x ditonton</span>
						<span class="separator">•</span>
						<span class="upload-date">1 minggu yang lalu</span>
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

				<!-- Komentar Section -->
				<section class="comments-section">
					<h2 class="comments-title">Komentar ({comments.length})</h2>

					<div class="comment-list">
						{#each comments as comment}
							<div class="comment">
								<img class="comment-avatar" src={comment.avatar} alt={comment.user} />
								<div class="comment-content">
									<div class="comment-header">
										<span class="comment-user">{comment.user}</span>
										<span class="comment-time">{comment.time}</span>
									</div>
									<p class="comment-text">{comment.text}</p>
									<div class="comment-actions">
										<button class="like-btn">
											<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
												<path
													d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
													fill="currentColor"
												/>
											</svg>
											<span>{comment.likes}</span>
										</button>
										<button class="reply-btn">Balas</button>
									</div>
								</div>
							</div>
						{/each}
					</div>

					<div class="add-comment">
						<img class="user-avatar" src="https://i.pravatar.cc/150?img=11" alt="Your avatar" />
						<input type="text" placeholder="Tambah komentar..." class="comment-input" />
						<button class="post-btn">Kirim</button>
					</div>
				</section>
			</div>

			<!-- Sidebar with other videos -->
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
	/* Base Styles */
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
		min-width: 0; /* Prevent flex item from overflowing */
	}

	.sidebar {
		width: 320px;
		flex-shrink: 0;
	}

	/* Video Container */
	.video-container {
		background: #000;
		border-radius: 8px;
		overflow: hidden;
		aspect-ratio: 16/9;
	}

	/* Video Info Section */
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

	/* Description Styles */
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

	/* Sidebar Styles */
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
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.video-views {
		font-size: 0.8rem;
		color: #aaaaaa;
	}

	/* Komentar Section */
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

	.add-comment {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: 24px;
	}

	.user-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
	}

	.comment-input {
		flex: 1;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 20px;
		padding: 10px 16px;
		color: #ffffff;
		font-size: 0.9rem;
		outline: none;
	}

	.comment-input::placeholder {
		color: #aaaaaa;
	}

	.post-btn {
		background: #065fd4;
		color: white;
		border: none;
		border-radius: 20px;
		padding: 10px 16px;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
	}

	.post-btn:hover {
		background: #0554b9;
	}

	/* Responsive Styles */
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

		.comment-input {
			padding: 8px 14px;
		}

		.post-btn {
			padding: 8px 14px;
		}
	}
</style>
