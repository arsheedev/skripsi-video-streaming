import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface ResponseInterface {
	results:
		| {
				name: {
					first: string
					last: string
				}
				email: string
				login: {
					username: string
				}
				picture: {
					large: string
					medium: string
					thumbnail: string
				}
		  }[]
		| null
	error: string | null
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export async function getUser() {
	const fetchData = await fetch('https://randomuser.me/api?nat=us')
	const res: ResponseInterface = await fetchData.json()

	if (res.results && !res.error) {
		console.log('test')
		return {
			username: res.results[0].login.username,
			name: res.results[0].name.first + ' ' + res.results[0].name.last,
			imageUrl: res.results[0].picture.thumbnail
		}
	}

	const user = 'User' + Math.floor(Math.random() * (1000 - 1 + 1)) + 1

	return { username: user, name: user, imageUrl: '/profile.png' }
}

export function loadVideo() {
	return setInterval(async () => {
		await fetch('/texas.jpg')
	}, 1000)
}

export function clearVideo(video: NodeJS.Timeout) {
	clearInterval(video)
}
