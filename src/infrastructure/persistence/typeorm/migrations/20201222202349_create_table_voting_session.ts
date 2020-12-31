import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateTableVotingSession20201222202349 implements MigrationInterface {
    private schema = process.env.DB_SCHEMA;

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: `${this.schema}.voting_session`,
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
                        name: 'client_id',
                        type: 'varchar',
                    },
                    {
                        name: 'start',
                        type: 'timestamp',
                    },
                    {
                        name: 'end',
                        type: 'timestamp',
                        isNullable: true,
                    },
                ],
            }),
        );

        await queryRunner.createIndices(`${this.schema}.voting_session`, [
            new TableIndex({
                name: 'idx_voting_session_client_id',
                columnNames: ['client_id'],
            }),
        ]);
    }

    public down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.dropTable(`${this.schema}.voting_session`);
    }
}
