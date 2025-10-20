import { createClient } from 'redis'

const redisUrl = process.env.REDIS_URL;
console.log('Redis URL:', redisUrl);

export const redis = createClient({
  url: redisUrl,
})