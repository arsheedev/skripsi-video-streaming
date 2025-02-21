import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ cookies, locals }) => {
	cookies.delete('authToken', { path: '/' })
	locals.session = null

	redirect(302, '/')
}
