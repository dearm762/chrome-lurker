export interface Statistic {
	category_name: string // Имя категории. Может быть пустым для общей статистики.
	accepted_today: number // Количество принятых сегодня тикетов.
	cancelled_today: number // Количество отмененных сегодня тикетов.
	passed_today: number // Количество пропущенных (skipped) сегодня тикетов.
	serviced_today: number // Количество обслуженных (completed) сегодня тикетов.
	serviced_all_time: number // Общее количество обслуженных тикетов за все время.
	accepted_all_time: number // Общее количество принятых тикетов за все время.
}

export interface StatisticResponse {
	general_data: Statistic // Общие данные для всех категорий.
	categories: Statistic[] // Список статистик по отдельным категориям.
}
