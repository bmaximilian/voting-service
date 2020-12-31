import { BeforeInsert, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuid4 } from 'uuid';

export abstract class BaseEntity {
    @PrimaryColumn({
        length: 40,
    })
    public id: string;

    @CreateDateColumn({
        name: 'created_at',
    })
    public createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
    })
    public updatedAt: Date;

    public constructor(id?: string, createdAt?: Date, updatedAt?: Date) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // TODO: Check if done with service integration tests
    /* istanbul ignore next */
    @BeforeInsert()
    protected createId(): void {
        if (this.id) {
            return;
        }

        this.id = uuid4();
    }
}
