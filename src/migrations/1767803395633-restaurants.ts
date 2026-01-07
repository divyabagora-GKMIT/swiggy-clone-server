import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Restaurants1767803395633 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.createTable(
              new Table({
                name: 'restaurants',
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
                    name: 'city_id',
                    type: 'int',
                    isNullable: false,
                  },
                  {
                    name: 'pincode',
                    type: 'varchar',
                    length: '10',
                    isNullable: false,
                  },
                  {
                    name: 'name',
                    type: 'varchar',
                    length: '30',
                    isNullable: false,
                  },
                  {
                    name: 'image',
                    type: 'varchar',
                    length: '255',
                    isNullable: true,
                  },
                  {
                    name: 'classification',
                    type: 'enum',
                    enum: ['VEG', 'NON-VEG', 'BOTH'],
                    enumName: 'restaurant_classification_enum',
                  },
                  {
                    name: 'latitude',
                    type: 'float',
                    isNullable: true,
                  },
                  {
                    name: 'longitude',
                    type: 'float',
                    isNullable: true,
                  },
                  {
                    name: 'radius',
                    type: 'float',
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
              'restaurants',
              new TableForeignKey({
                columnNames: ['user_id'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
              }),
            );
        
            await queryRunner.createForeignKey(
              'restaurants',
              new TableForeignKey({
                columnNames: ['city_id'],
                referencedTableName: 'cities',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
              }),
            );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
