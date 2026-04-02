import { hash } from 'bcrypt';
import { BaseEntity, SetRepository } from 'core/entities';
import { postgresDataSource } from 'shared/connections';
import {
    AfterLoad,
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import crypto from 'crypto';
import config from 'config';
import { Exclude } from 'class-transformer';

@Entity({ name: 'database_configurations' })
@SetRepository(postgresDataSource)
export class DatabaseConfigurationEntity {
    @Column()
    @PrimaryGeneratedColumn()
    _id: string;

    @Column()
    host: string;

    @Column()
    port: string;

    @Column()
    username: string;

    @Column()
    @Exclude({ toPlainOnly: true })
    password: string;

    @Column()
    databaseName: string;

    @CreateDateColumn({
        default: `now()`,
    })
    createdAt: Date;

    @Column()
    @Exclude({ toPlainOnly: true })
    accessToken: string;

    @UpdateDateColumn({
        default: `now()`,
        onUpdate: 'now()',
    })
    updatedAt: Date;

    @Exclude({ toPlainOnly: true })
    currentPassword: string;

    @AfterLoad()
    _setCurrentPassword() {
        this.currentPassword = this.password;
    }

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (!this.password) {
            return;
        }
        if (this.password !== this.currentPassword) {
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv(
                'aes-256-ctr',
                Buffer.from(config.get<string>('cipherSecret'), 'hex'),
                iv
            );
            let encrypted = cipher.update(this.password, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            this.password = iv.toString('hex') + ':' + encrypted;
        }
    }
}
