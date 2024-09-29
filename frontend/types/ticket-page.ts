export default interface ticket {
    ticket_id: number,
    ticket_number: string,
    front_queue: number,
    current_ticket: string,
    ticket_created_time: string
    category_id: number,
    token: string,
    average_duration: number
}