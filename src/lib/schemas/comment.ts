import { z } from 'zod'

const CommentSchema = z.object({
	name: z.string().min(1, 'Name is required!'),
	username: z.string().min(1, 'Username is required'),
	imageUrl: z.string().min(1, 'Image is required!'),
	comment: z.string().min(1, 'Type your comment first!'),
	videoAssetId: z.coerce.number().min(1)
})

export default CommentSchema
