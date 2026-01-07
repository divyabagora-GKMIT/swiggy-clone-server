import { Exclude } from "class-transformer";
import { UserRole } from "src/users/entities/user_role.entity";
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn,UpdateDateColumn, OneToMany } from "typeorm";

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({
        nullable : false,
        length: 10
    })
    name :string

    @OneToMany(() => UserRole, userRole => userRole.role)
    userRoles: UserRole[];

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
      })
      createdAt: Date;
    
      @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
      })
      updatedAt: Date;
    
      @Exclude()
      @DeleteDateColumn({
        name: 'deleted_at',
        nullable: true,
        type: 'timestamp',
      })
      deletedAt: Date;
}