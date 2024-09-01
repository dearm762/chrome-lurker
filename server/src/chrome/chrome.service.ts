import { Injectable } from '@nestjs/common'

@Injectable()
export class ChromeService {
	async sendToTelegram(address: string) {
		// const _botToken = ''
		const url = `https://api.telegram.org/bot${'7264760628:AAF9lm1QjxJaNdIpMz24rQ5DBJ6497Y8hV0'}/sendMessage`

		const params = {
			chat_id: 928372069,
			text: address
		}

		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(params),
			})

			if (response.ok) {
				console.log('Message sent successfully')
			} else {
				console.error('Error sending message:', response.statusText)
			}
		} catch (error) {
			console.error('Error:', error)
		}
	}
}
