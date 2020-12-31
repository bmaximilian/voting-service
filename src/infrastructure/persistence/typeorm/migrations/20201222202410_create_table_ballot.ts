import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTableBallot20201222202410 implements MigrationInterface {
    private schema = process.env.DB_SCHEMA;

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: `${this.schema}.voting_ballot`,
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
                        name: 'answer_option',
                        type: 'varchar',
                    },
                    {
                        name: 'topic_id',
                        type: 'varchar',
                        length: '40',
                    },
                    {
                        name: 'participant_id',
                        type: 'varchar',
                        length: '40',
                    },
                    {
                        name: 'mandate_id',
                        type: 'varchar',
                        length: '40',
                        isNullable: true,
                    },
                ],
            }),
        );

        await queryRunner.createForeignKey(
            `${this.schema}.voting_ballot`,
            new TableForeignKey({
                columnNames: ['topic_id'],
                referencedColumnNames: ['id'],
                referencedTableName: `${this.schema}.voting_topic`,
            }),
        );

        await queryRunner.createForeignKey(
            `${this.schema}.voting_ballot`,
            new TableForeignKey({
                columnNames: ['participant_id'],
                referencedColumnNames: ['id'],
                referencedTableName: `${this.schema}.participant`,
            }),
        );

        await queryRunner.createForeignKey(
            `${this.schema}.voting_ballot`,
            new TableForeignKey({
                columnNames: ['mandate_id'],
                referencedColumnNames: ['id'],
                referencedTableName: `${this.schema}.mandate`,
            }),
        );
    }

    public down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.dropTable(`${this.schema}.voting_ballot`);
    }
}
