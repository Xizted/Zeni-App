export interface Environment {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  REDIS_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_TTL_SECONDS: number;
  JWT_REFRESH_TTL_SECONDS: number;
}

const requiredString = (
  config: Record<string, unknown>,
  key: string,
): string => {
  const value = config[key];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${key} is required`);
  }
  return value;
};

const positiveInteger = (
  config: Record<string, unknown>,
  key: string,
  fallback: number,
): number => {
  const raw = config[key] ?? fallback;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${key} must be a positive integer`);
  }
  return value;
};

export const validateEnvironment = (
  config: Record<string, unknown>,
): Environment => {
  const accessSecret = requiredString(config, 'JWT_ACCESS_SECRET');
  const refreshSecret = requiredString(config, 'JWT_REFRESH_SECRET');

  if (accessSecret.length < 32 || refreshSecret.length < 32) {
    throw new Error('JWT secrets must contain at least 32 characters');
  }
  if (accessSecret === refreshSecret) {
    throw new Error('JWT access and refresh secrets must be different');
  }

  return {
    NODE_ENV:
      typeof config.NODE_ENV === 'string' ? config.NODE_ENV : 'development',
    PORT: positiveInteger(config, 'PORT', 3000),
    DATABASE_URL: requiredString(config, 'DATABASE_URL'),
    REDIS_URL: requiredString(config, 'REDIS_URL'),
    JWT_ACCESS_SECRET: accessSecret,
    JWT_REFRESH_SECRET: refreshSecret,
    JWT_ACCESS_TTL_SECONDS: positiveInteger(
      config,
      'JWT_ACCESS_TTL_SECONDS',
      900,
    ),
    JWT_REFRESH_TTL_SECONDS: positiveInteger(
      config,
      'JWT_REFRESH_TTL_SECONDS',
      2_592_000,
    ),
  };
};
