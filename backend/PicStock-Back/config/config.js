require('dotenv').config();

function baseConfig() {
  const cfg = {
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true
    },
    dialectOptions: {}
  };

  // Ativa SSL quando usando provedores gerenciados como Supabase
  if (process.env.DB_SSL === 'true') {
    cfg.dialectOptions.ssl = {
      require: true,
      rejectUnauthorized: false // use um CA se quiser validar estritamente
    };
  }

  return cfg;
}

function envConfig(defaults = {}) {
  // Se houver DATABASE_URL (ex.: do Supabase), usa ela
  if (process.env.DATABASE_URL) {
    return {
      ...baseConfig(),
      use_env_variable: 'DATABASE_URL'
    };
  }

  // Caso contrário, usa os campos individuais
  return {
    ...baseConfig(),
    username: process.env.DB_USERNAME || defaults.username,
    password: process.env.DB_PASSWORD || defaults.password,
    database: process.env.DB_NAME || defaults.database,
    host: process.env.DB_HOST || defaults.host,
    port: process.env.DB_PORT || defaults.port
  };
}

module.exports = {
  development: envConfig({
    username: 'postgres',
    password: 'postgres',
    database: 'picstock_dev',
    host: 'localhost',
    port: 5432
  }),
  test: envConfig({
    username: 'postgres',
    password: 'postgres',
    database: (process.env.DB_NAME || 'picstock') + '_test',
    host: 'localhost',
    port: 5432
  }),
  production: envConfig()
};
