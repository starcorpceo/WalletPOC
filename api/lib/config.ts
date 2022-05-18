interface Config {
  databaseUrl: string;
  backupDatabaseUrl: string;
}

const config: Config = {
  databaseUrl: process.env.MAIN_DB_URL || "",
  backupDatabaseUrl: process.env.BACKUP_DB_URL || "",
};

export default config;
