import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function loadVideo() {
	return setInterval(async () => {
		await fetch('/test-file.bin', { cache: 'no-store' })
	}, 100)
}

export function clearVideo(video: NodeJS.Timeout) {
	clearInterval(video)
}
