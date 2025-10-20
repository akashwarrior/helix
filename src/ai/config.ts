import type { JSONValue } from 'ai'
import { google } from '@ai-sdk/google'
import { Sandbox } from "@vercel/sandbox";
import type { LanguageModelV2 } from '@ai-sdk/provider'
import { redis } from '@/lib/redis';
import { createS3Client } from '@/lib/s3';
import { GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

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

// sandbox ----
export function getSandbox(sandboxId: string): Promise<Sandbox> {
  return Sandbox.get({
    sandboxId,
    token: process.env.VERCEL_ACCESS_TOKEN,
    projectId: process.env.VERCEL_PROJECT_ID,
    teamId: process.env.VERCEL_TEAM_ID,
  })
}

export async function getSandboxId(projectId: string): Promise<string> {
  await redis.connect();
  const sandboxId = await redis.get(`sandbox:${projectId}`);
  if (sandboxId) {
    await redis.close();
    return sandboxId;
  }

  const sandbox = await Sandbox.create({
    runtime: 'node22',
    timeout: 10 * 60 * 1000, // 10 minutes
    ports: [3000],
    token: process.env.VERCEL_ACCESS_TOKEN,
    projectId: process.env.VERCEL_PROJECT_ID,
    teamId: process.env.VERCEL_TEAM_ID,
  });

  await redis.set(`sandbox:${projectId}`, sandbox.sandboxId);
  await redis.expire(`sandbox:${projectId}`, 10 * 60);
  await redis.close();

  const client = createS3Client();
  const { Contents = [] } = await client.send(new ListObjectsV2Command({ Bucket: projectId }));

  const fileContents = await Promise.all(
    Contents.filter(f => f.Key).map(async (f) => {
      const res = await client.send(new GetObjectCommand({ Bucket: projectId, Key: f.Key }));
      const content = await res.Body?.transformToString() ?? '';
      return { path: f.Key!, content: Buffer.from(content, 'utf8') };
    })
  );

  if (fileContents.length > 0) {
    await sandbox.writeFiles(fileContents);

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

  return sandbox.sandboxId;
}

export async function getSandboxUrl(sandboxId: string): Promise<string | null> {
  try {
    const sandbox = await getSandbox(sandboxId);
    return sandbox.domain(3000);
  } catch (error) {
    return null;
  }
}