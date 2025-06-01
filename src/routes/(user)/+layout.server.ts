import type { LayoutServerLoad } from './$types'

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

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
	const userData = cookies.get('userData')

	if (!userData) {
		const fetchData = await fetch('https://randomuser.me/api?nat=us')
		const res: ResponseInterface = await fetchData.json()

		if (res.results && !res.error) {
			const userData = {
				username: res.results[0].login.username,
				name: res.results[0].name.first + ' ' + res.results[0].name.last,
				imageUrl: res.results[0].picture.thumbnail
			}

			cookies.set('userData', JSON.stringify(userData), {
				path: '/',
				httpOnly: true,
				sameSite: true
			})
		} else {
			const userData = { username: 'anonymous', name: 'anonymous', imageUrl: '/profile.png' }

			cookies.set('userData', JSON.stringify(userData), {
				path: '/',
				httpOnly: true,
				sameSite: true
			})
		}
	}
}
