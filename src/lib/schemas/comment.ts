import { z } from 'zod'

const CommentSchema = z.object({
	comment: z.string().min(1, 'Type your comment first!')
})

export default CommentSchema
