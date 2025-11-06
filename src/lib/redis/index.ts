import { createClient, type SetOptions } from "redis";

const redisUrl = process.env.REDIS_URL;

export function getRedisClient() {
  const client = createClient({
    url: redisUrl,
  });
  return client;
}

export async function setKey(key: string, value: string, options?: SetOptions) {
  const redisClient = getRedisClient();
  try {
    await redisClient.connect();
    await redisClient.set(key, value, options);
  } catch (e) {
    console.log(`Redis set key key:${key} value:${value}`, e);
  } finally {
    await redisClient.close();
  }
}

export async function getKey(key: string): Promise<string | null> {
  const redisClient = getRedisClient();
  try {
    await redisClient.connect();
    return await redisClient.get(key);
  } catch (e) {
    console.log(`Redis get key key:${key}`, e);
  } finally {
    await redisClient.close();
  }

  return null;
}
