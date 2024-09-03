export interface GeneralData {
    clients_in_queue: number;
    accepted_today: number;
    served_today: number;
}

export interface UserOut {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    // добавьте другие поля, которые есть в вашей модели пользователя
}

export interface CategoryResponse {
    id: number;
    name: string;
    users: UserOut[];
}

export interface AdminDashboard {
    general_data: GeneralData;
    user: UserOut;
    categories: CategoryResponse[];
}
export interface category {
    id: number | null
    name: string
}