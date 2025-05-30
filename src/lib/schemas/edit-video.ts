import { z } from 'zod'

const EditVideoSchema = z.object({
	name: z.string().min(1, 'Video need is required!'),
	description: z.string().optional().nullable(),
	thumbnail: z.any().nullable().optional()
})
export default EditVideoSchema
