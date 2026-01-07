import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CitiesModule } from './cities/cities.module';
import { CountriesModule } from './countries/countries.module';
import { StatesModule } from './states/states.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { User } from './users/entities/user.entity';
import { UserRole } from './users/entities/user_role.entity';
import { Role } from './roles/entities/role.entity';
import { Country } from './countries/entities/country.entity';
import { State } from './states/entities/state.entity';
import { City } from './cities/entities/city.entity';
import { Address } from './users/entities/address.entity';
import { OrdersModule } from './orders/orders.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ItemsModule } from './items/items.module';
import { Restaurant } from './restaurants/entities/restaurant.entity';
import { Item } from './items/entities/item.entity';
import { Order } from './orders/entites/order.entity';
import { RatingsModule } from './ratings/ratings.module';
import { Rating } from './ratings/entities/rating.entity';
import { Cart } from './users/entities/cart.entity';
import { CartItem } from './users/entities/cartItems.entity';
import { Transaction } from './transactions/entities/transaction.entity';
import { OrderItemsModule } from './order-items/order-items.module';
import { OrderItem } from './order-items/order-items.entity';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    CitiesModule,
    CountriesModule,
    StatesModule,
    RestaurantsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
        username: configService.get<string>('DB_USERNAME', 'divyabagora'),
        password: configService.get<string>('DB_PASSWORD', 'divya'),
        database: configService.get<string>('DB_NAME', 'swiggydb'),
        entities: [
          User,
          UserRole,
          Role,
          Country,
          State,
          City,
          Address,
          Restaurant,
          Item,
          Order,
          Rating,
          Cart,
          CartItem,
          Transaction,
          OrderItem
        ],
        // autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    OrdersModule,
    TransactionsModule,
    ItemsModule,
    RatingsModule,
    OrderItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
