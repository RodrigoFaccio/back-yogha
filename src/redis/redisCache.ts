import redis from 'ioredis';

const redisClient = redis.createClient();

// Função para verificar se o cache existe para uma determinada chave
const checkCache = (cacheKey: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    redisClient.get(cacheKey, (error: any, data: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

// Função para definir o valor do cache para uma determinada chave
const setCache = (cacheKey: string, value: string, expirationTime: number): void => {
  redisClient.setex(cacheKey, expirationTime, value);
};

// Função para encerrar a conexão com o Redis
const quitRedisClient = (): void => {
  redisClient.quit();
};

export { checkCache, setCache, quitRedisClient };
