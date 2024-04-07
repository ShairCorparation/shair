import environ

env = environ.Env(
    SECRET_KEY=(str, 'secret_key'),
    DEBUG=(bool, True),
    ALLOWED_HOSTS=(str, '*'),
    POSTGRES_DB=(str, 'postgres_db'),
    POSTGRES_USER=(str, 'postgres_db'),
    POSTGRES_PASSWORD=(str, 'postgres_db'),
    POSTGRES_HOST=(str, 'localhost'),
    POSTGRES_PORT=(int, None),
    FRONTEND_URL=(str, 'http://localhost:3000'),
    BACKEND_URL=(str, 'http://localhost:8000'),

    FILE_STORAGE=(str, 'local'),

    REDIS_HOST=(str, 'redis'),
    REDIS_PORT=(int, 6379),
    REDIS_DB=(int, 1),
    REDIS_URL=(str, ''),

    OXILOR_URL=(str, ''),
    OXILOR_KEY=(str, ''),
)