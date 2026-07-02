import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users/user.entity';
import * as dotenv from 'dotenv';
dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(User);

  const existing = await repo.findOne({ where: { email: 'admin@medsocio.com' } });
  if (existing) {
    console.log('Super admin already exists');
    process.exit(0);
  }

  const hashed = await bcrypt.hash('Admin@1234', 10);
  await repo.save({
    email: 'admin@medsocio.com',
    password: hashed,
    name: 'Super Admin',
    role: 'SUPER_ADMIN',
    isActive: true,
  });

  console.log('✅ Super admin created: admin@medsocio.com / Admin@1234');
  process.exit(0);
}

seed().catch(console.error);