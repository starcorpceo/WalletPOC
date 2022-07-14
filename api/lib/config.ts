interface Config {
  databaseUrl: string;
  cookieSecret: string;
}

const config: Config = {
  databaseUrl: process.env.MAIN_DB_URL || "",
  cookieSecret: process.env.COOKIE_SECRET || "",
};

export default config;
