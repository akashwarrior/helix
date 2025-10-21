import type { JSONValue } from 'ai'
import { google } from '@ai-sdk/google'
import { Sandbox } from "@vercel/sandbox";
import { getRedisClient } from '@/lib/redis';
import { createS3Client } from '@/lib/s3';
import { GetObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3';
import type { LanguageModelV2 } from '@ai-sdk/provider'
import type { Credentials } from '@vercel/sandbox/dist/utils/get-credentials';

export type GoogleModels = Parameters<typeof google>[0]
export const DEFAULT_MODEL: GoogleModels = 'gemini-2.5-flash-lite-preview-09-2025';

export function getAvailableModels() {
  return [
    { name: 'Gemini Pro', id: 'gemini-2.5-pro' },
    { name: 'Gemini Flash', id: 'gemini-2.5-flash-preview-09-2025' },
    { name: 'Gemini Flash Lite', id: 'gemini-2.5-flash-lite-preview-09-2025' },
  ]
}

export interface ModelOptions {
  model: LanguageModelV2
  providerOptions?: Record<string, Record<string, JSONValue>>
}

export function getModelOptions(modelId: GoogleModels = DEFAULT_MODEL): ModelOptions {
  return {
    model: google(modelId),
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingBudget: -1,
          includeThoughts: true,
        }
      }
    }
  }
}

// sandbox config

const sandboxConfig: Credentials = {
  token: process.env.VERCEL_ACCESS_TOKEN!,
  projectId: process.env.VERCEL_PROJECT_ID!,
  teamId: process.env.VERCEL_TEAM_ID!,
}

export function getSandbox(sandboxId: string): Promise<Sandbox> {
  return Sandbox.get({
    sandboxId,
    ...sandboxConfig,
  })
}

const redisKey = (projectId: string) => `sandbox:${projectId}` as const;

export async function createSandbox(projectId: string): Promise<Sandbox> {
  const redis = await getRedisClient();
  await redis.connect();
  const sandboxId = await redis.get(redisKey(projectId));

  if (sandboxId) {
    await redis.close();
    return getSandbox(sandboxId);
  }

  const sandbox = await Sandbox.create({
    runtime: 'node22',
    timeout: 10 * 60 * 1000, // 10 minutes
    ports: [3000],
    ...sandboxConfig,
  });

  await redis.set(redisKey(projectId), sandbox.sandboxId, { expiration: { type: 'EX', value: 10 * 60 } });
  await redis.close();

  const fileContents = await getFiles(projectId);

  if (fileContents.length > 0) {
    await sandbox.writeFiles(
      fileContents.map((f) => ({
        path: f.path,
        content: Buffer.from(f.content, 'utf8'),
      }))
    );
    await sandbox.runCommand({
      cmd: 'pnpm',
      args: ['install'],
      detached: false,
    });
    await sandbox.runCommand({
      cmd: 'pnpm',
      args: ['run', 'dev'],
      detached: true,
    });
  }

  return sandbox;
}

export async function getFiles(projectId: string) {
  const client = createS3Client();
  try {
    const { Contents = [] } = await client.send(new ListObjectsCommand({ Bucket: projectId }));
    return await Promise.all(Contents.filter(f => f.Key).map(async (f) => {
      const res = await client.send(new GetObjectCommand({ Bucket: projectId, Key: f.Key }));
      const content = await res.Body?.transformToString() ?? '';
      return { path: f.Key!, content };
    }));
  } catch {
    console.log('Bucket not found');
    return [];
  } finally {
    client.destroy();
  }
}