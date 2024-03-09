import { FileAws } from "src/files/entities/file.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    token: string;

    @Column({ default: true })
    active: boolean;

    @Column({ default: new Date() })
    created_at: Date;

    @Column({ default: new Date() })
    updated_at: Date;

    @Column({ nullable: true })
    reset_password_code: string;

    @OneToMany(() => FileAws, file => file.user)   
    files: File[];

    constructor(user: Partial<User>) {
        Object.assign(this, user);
    }
}
