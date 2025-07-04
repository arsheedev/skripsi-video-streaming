import { hash } from '@node-rs/argon2'
import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()
async function main() {
	const hashedPassword = await hash('asdfasdf', {
		// recommended minimum parameters
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	})

	await db.user.create({
		data: {
			name: 'admin',
			username: 'admin',
			password: hashedPassword,
			role: 'ADMIN',
			email: 'riyanfanani110@gmail.com',
			imageUrl: '/admin.png'
		}
	})
}
main()
	.then(async () => {
		await db.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await db.$disconnect()
		process.exit(1)
	})
