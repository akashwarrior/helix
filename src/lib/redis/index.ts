import { createClient } from 'redis'

const redisUrl = process.env.REDIS_URL;

export async function getRedisClient() {
  const client = createClient({
    url: redisUrl,
  })
  return client
}