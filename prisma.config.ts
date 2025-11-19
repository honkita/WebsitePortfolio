import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: "postgresql://postgres.uecvgjsmtewgadzizqgt:sufxyx-byMbob-0nonvu@aws-1-us-east-2.pooler.supabase.com:5432/postgres",
  },
});
