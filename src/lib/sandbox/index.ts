import { Sandbox } from "@vercel/sandbox";
import { getKey, setKey } from "@/lib/redis";
import { getFilesFromS3 } from "@/lib/s3";
import { File } from "@/lib/types";

const TIMEOUT = 10 * 60 * 1000; // 10 minutes

const sandboxConfig: Parameters<typeof Sandbox.create>[0] = {
  runtime: "node22",
  timeout: TIMEOUT,
  ports: [3000],
  source: {
    type: "git",
    url: process.env.TEMPLATE!,
  },
  token: process.env.VERCEL_ACCESS_TOKEN!,
  projectId: process.env.VERCEL_PROJECT_ID!,
  teamId: process.env.VERCEL_TEAM_ID!,
};

export function getSandbox(sandboxId: string): Promise<Sandbox> {
  return Sandbox.get({
    sandboxId,
    ...sandboxConfig,
  });
}

const redisKey = (projectId: string) => `sandbox:${projectId}` as const;

export async function createSandbox(
  projectId: string,
  files?: File[],
): Promise<Sandbox> {
  const sandboxId = await getKey(redisKey(projectId));
  if (sandboxId) {
    return getSandbox(sandboxId);
  }

  const sandbox = await Sandbox.create(sandboxConfig);

  await setKey(redisKey(projectId), sandbox.sandboxId, {
    expiration: { type: "PX", value: TIMEOUT },
  });

  await sandbox.runCommand({
    cmd: "pnpm",
    args: ["install"],
  });

  await sandbox.runCommand({
    cmd: "pnpm",
    args: ["dev"],
    detached: true,
  });

  fetch(sandbox.domain(3000)).catch(() => {});

  const fileContents = files || (await getFilesFromS3(projectId));

  if (fileContents.length > 0) {
    await writeFilesToSandbox(sandbox, fileContents);
  }

  return sandbox;
}

export function writeFilesToSandbox(sandbox: Sandbox, files: File[]) {
  return sandbox.writeFiles(
    files.map((f) => ({
      content: Buffer.from(f.content, "utf8"),
      path: f.path,
    })),
  );
}
