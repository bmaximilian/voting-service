import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateTableMandate20201222202402 implements MigrationInterface {
    private schema = process.env.DB_SCHEMA;

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: `${this.schema}.mandate`,
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
                        name: 'mandated_participant_id',
                        type: 'varchar',
                        length: '40',
                    },
                    {
                        name: 'mandated_by_participant_id',
                        type: 'varchar',
                        length: '40',
                    },
                ],
            }),
        );

        await queryRunner.createForeignKey(
            `${this.schema}.mandate`,
            new TableForeignKey({
                columnNames: ['mandated_participant_id'],
                referencedColumnNames: ['id'],
                referencedTableName: `${this.schema}.participant`,
            }),
        );

        await queryRunner.createForeignKey(
            `${this.schema}.mandate`,
            new TableForeignKey({
                columnNames: ['mandated_by_participant_id'],
                referencedColumnNames: ['id'],
                referencedTableName: `${this.schema}.participant`,
            }),
        );

        await queryRunner.createIndices(`${this.schema}.mandate`, [
            new TableIndex({
                name: 'idx_mandate_mandated_participant_id',
                columnNames: ['mandated_participant_id'],
            }),
            new TableIndex({
                name: 'idx_mandate_mandated_by_participant_id_id',
                columnNames: ['mandated_by_participant_id'],
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropIndices(`${this.schema}.mandate`, [
            new TableIndex({
                name: 'idx_mandate_mandated_participant_id',
                columnNames: ['mandated_participant_id'],
            }),
            new TableIndex({
                name: 'idx_mandate_mandated_by_participant_id_id',
                columnNames: ['mandated_by_participant_id'],
            }),
        ]);

        return queryRunner.dropTable(`${this.schema}.mandate`);
    }
}
