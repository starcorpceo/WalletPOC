interface Config {
  databaseUrl: string;
  backupDatabaseUrl: string;
  cookieSecret: string;
}

const config: Config = {
  databaseUrl: process.env.MAIN_DB_URL || "",
  backupDatabaseUrl: process.env.BACKUP_DB_URL || "",
  cookieSecret: process.env.COOKIE_SECRET || "",
};

export default config;
