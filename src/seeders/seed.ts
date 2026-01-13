import { AppDataSource } from '../data-source';
import { LocationSeeder } from "./location.seeder";

AppDataSource.initialize().then(async () => {
  await LocationSeeder(AppDataSource);
  process.exit();
});