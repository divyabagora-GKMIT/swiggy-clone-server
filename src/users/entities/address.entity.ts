import { City } from "src/cities/entities/city.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('addresses')
export class Address {
    @PrimaryGeneratedColumn()
    id : number

    @Column({
        nullable:  false,
        length : 255
    })
    address : string

    @Column({
        nullable: false,
        length: 10
    })
    pincode: string

    @ManyToOne(() => User,  user => user.addresses)
    @JoinColumn({name : 'user_id'})
    user: User

    @ManyToOne(() => City, city => city.addresses)
    @JoinColumn({name: 'city_id'})
    city: City
    
     
    
}