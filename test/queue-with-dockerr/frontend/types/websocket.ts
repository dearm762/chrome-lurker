export type NewTicket = {
    id: number
    phone_number: string
    full_name: string
    created_at: string
    category_id: number
    status: string
    number: string
    worker_id: number | null
    language: string
}

export type NewTicketWrapper = {
    window: number | null
    ticket: NewTicket
}

export interface WebSocketMessage {
    action: string
    category_id: number
    data: NewTicket | NewTicketWrapper
}

export const isNewTicket = (data: any): data is NewTicket => {
    return (data as NewTicket).id !== undefined;
}