export class FindUserDto {
    id: number;
    email: string;
    password: string;
    active: boolean;
    reset_password_code: string;
    created_at: Date;
    updated_at: Date;
}
