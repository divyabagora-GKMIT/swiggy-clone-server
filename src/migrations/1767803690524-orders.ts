import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Orders1767803690524 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
     await queryRunner.createTable(
          new Table({
            name: 'orders',
            columns: [
              {
                name: 'id',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
              },
              {
                name: 'user_id',
                type: 'int',
                isNullable: false,
              },
              {
                name: 'delivery_partner_id',
                type: 'int',
                isNullable: true,
              },
              {
                name: 'restaurant_id',
                type: 'int',
                isNullable: false,
              },
              {
                name: 'status',
                type: 'enum',
                enum: ['Preparing', 'Assigned', 'Delivered', 'Cancelled'],
                enumName: 'order_status_enum',
                isNullable: false,
              },
              {
                name: 'total_amount',
                type: 'float',
                isNullable: false,
              },
              {
                name: 'gst',
                type: 'float',
                isNullable: false,
              },
              {
                name: 'delivery_charge',
                type: 'float',
                isNullable: false,
              },
              {
                name: 'address',
                type: 'varchar',
                length: '255',
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
          'orders',
          new TableForeignKey({
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        );
    
        await queryRunner.createForeignKey(
          'orders',
          new TableForeignKey({
            columnNames: ['delivery_partner_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          }),
        );
    
        await queryRunner.createForeignKey(
          'orders',
          new TableForeignKey({
            columnNames: ['restaurant_id'],
            referencedTableName: 'restaurants',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('orders');
        await queryRunner.query(`DROP TYPE "order_status_enum"`);
      }
    }
    