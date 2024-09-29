import { WebSocketMessage } from '@/types/websocket'

let socket: WebSocket | null = null

export const initiateSocket = (setStatus: (status: boolean) => void): void => {
	socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!)

	socket.onopen = () => {
		setStatus(true) // Update status to connected
	}

	socket.onclose = () => {
		setStatus(false) // Update status to disconnected
	}

	socket.onerror = () => {
		setStatus(false) // Update status to error
	}
}

export const disconnectSocket = (): void => {
	if (socket) {
		socket.close()
	}
}

export const subscribeToEvent = (
	callback: (data: WebSocketMessage) => void
): void => {
	if (!socket) return

	socket.onmessage = event => {
		try {
			const eventData: WebSocketMessage = JSON.parse(event.data)
			callback(eventData)
		} catch (error) {
			console.error('Error parsing WebSocket message:', error)
		}
	}
}
