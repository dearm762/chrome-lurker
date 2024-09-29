export interface User {
	id: number
	first_name: string
	last_name: string
	email: string
	is_admin: boolean
	window: number
	token: string
	category_id: number
}

export interface PersonalData {
	user: User
	accepted_today: number
	skipped_today: number
	served_today: number
}

export interface GeneralData {
	clients_in_queue: number
	accepted_today: number
	served_today: number
}

export interface TicketData {
	id: number
	phone_number: string
	full_name: string
	created_at: string
	category_id: number
	status: string
	number: string
	worker_id: number
	language: string
}

export interface CurrentTicket {
	ticket_data: TicketData | null
	ticket_id: number
	ticket_number: number
	category_name: string
	ticket_created_time: string
	ticket_language: string
	ticket_phone_number: string
	ticket_full_name: string
}

export interface Data {
	category_name: string
	personal_data: PersonalData
	general_data: GeneralData
	current_ticket: CurrentTicket | null
}
