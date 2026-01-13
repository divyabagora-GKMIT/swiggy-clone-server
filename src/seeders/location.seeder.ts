import { City } from '../cities/entities/city.entity';
import { Country } from '../countries/entities/country.entity';
import { State } from '../states/entities/state.entity';
import { DataSource } from 'typeorm';

export const LocationSeeder = async (dataSource: DataSource) => {
  const countryRepo = dataSource.getRepository(Country);
  const stateRepo = dataSource.getRepository(State);
  const cityRepo = dataSource.getRepository(City);

  const existing = await countryRepo.findOne({ where: { name: 'India' } });
  if (existing) {
    console.log('Location data already seeded');
    return;
  }

  const india = await countryRepo.save(countryRepo.create({ name: 'India' }));

  const rajasthan = await stateRepo.save(
    stateRepo.create({ name: 'Rajasthan', country: india }),
  );

  await cityRepo.save(cityRepo.create({ name: 'Udaipur', state: rajasthan }));

  console.log('Location data seeded successfully');
};
