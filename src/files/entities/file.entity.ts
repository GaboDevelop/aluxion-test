import { User } from "src/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class FileAws {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    bucket_url: string;

    @Column()
    file_name: string;

    @Column()
    key: string;

    @Column()
    mimetype: string;

    //relationship with user, user_id
    @ManyToOne(() => User, user => user.files)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ default: new Date() })
    created_at: Date;

    @Column({ default: new Date() })
    updated_at: Date;

    constructor(user: Partial<User>) {
        Object.assign(this, user);
    }
}
