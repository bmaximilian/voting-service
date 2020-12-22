import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTableParticipant20201222202401 implements MigrationInterface {
    private schema = process.env.DB_SCHEMA;

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: `${this.schema}.participant`,
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        isUnique: true,
                        length: '40',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'external_id',
                        type: 'varchar',
                        isUnique: true,
                    },
                    {
                        name: 'shares',
                        type: 'real',
                    },
                    {
                        name: 'voting_session_id',
                        type: 'varchar',
                        length: '40',
                    },
                ],
            }),
        );

        await queryRunner.createForeignKey(
            `${this.schema}.participant`,
            new TableForeignKey({
                columnNames: ['voting_session_id'],
                referencedColumnNames: ['id'],
                referencedTableName: `${this.schema}.voting_session`,
            }),
        );
    }

    public down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.dropTable(`${this.schema}.participant`);
    }
}
