import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: "postgresql://postgres.uecvgjsmtewgadzizqgt:eJ9xzkW4C7v-h-K@aws-1-us-east-2.pooler.supabase.com:6543/postgres",
  },
});
