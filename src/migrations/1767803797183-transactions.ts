import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class Transactions1767803797183 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'order_id',
            type: 'int',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['Success', 'Failed', 'Cancelled'],
            enumName: 'transaction_status_enum',
            isNullable: false,
          },
          {
            name: 'payment_mode',
            type: 'enum',
            enum: ['COD', 'Prepaid'],
            enumName: 'payment_mode_enum',
            isNullable: false,
          },
          {
            name: 'payment_type',
            type: 'enum',
            enum: ['UPI', 'credit_card', 'debit_card'],
            enumName: 'payment_type_enum',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedTableName: 'orders',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transactions');
    await queryRunner.query(`DROP TYPE "payment_type_enum"`);
    await queryRunner.query(`DROP TYPE "payment_mode_enum"`);
    await queryRunner.query(`DROP TYPE "transaction_status_enum"`);
  }
}
