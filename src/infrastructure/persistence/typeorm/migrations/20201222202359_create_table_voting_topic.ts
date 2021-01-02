import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex, TableUnique } from 'typeorm';

export class CreateTableVotingTopic20201222202359 implements MigrationInterface {
    private schema = process.env.DB_SCHEMA;

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: `${this.schema}.voting_topic`,
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
                    },
                    {
                        name: 'answer_options',
                        type: 'json',
                    },
                    {
                        name: 'abstention_answer_option',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'majority_type',
                        type: 'varchar',
                    },
                    {
                        name: 'majority_quorum_in_percent',
                        type: 'real',
                        isNullable: true,
                    },
                    {
                        name: 'required_number_of_shares_for_quorum',
                        type: 'real',
                    },
                    {
                        name: 'completed_at',
                        type: 'timestamp',
                        isNullable: true,
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
            `${this.schema}.voting_topic`,
            new TableForeignKey({
                columnNames: ['voting_session_id'],
                referencedColumnNames: ['id'],
                referencedTableName: `${this.schema}.voting_session`,
            }),
        );

        await queryRunner.createUniqueConstraint(
            `${this.schema}.voting_topic`,
            new TableUnique({
                columnNames: ['external_id', 'voting_session_id'],
            }),
        );

        await queryRunner.createIndex(
            `${this.schema}.voting_topic`,
            new TableIndex({
                columnNames: ['external_id'],
            }),
        );
    }

    public down(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.dropTable(`${this.schema}.voting_topic`);
    }
}
