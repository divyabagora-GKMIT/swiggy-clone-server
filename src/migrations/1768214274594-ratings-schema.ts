import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class RatingsSchema1768214274594 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
     await queryRunner.createTable(
      new Table({
        name: 'ratings',
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
            name: 'order_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'restaurant_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'item_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'rating',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'comment',
            type: 'varchar',
            length: '255',
            isNullable: true,
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
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKeys('ratings', [
      new TableForeignKey({
        name: 'FK_ratings_user',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_ratings_order',
        columnNames: ['order_id'],
        referencedTableName: 'orders',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_ratings_restaurant',
        columnNames: ['restaurant_id'],
        referencedTableName: 'restaurants',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        name: 'FK_ratings_item',
        columnNames: ['item_id'],
        referencedTableName: 'items',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ratings');
  }
}