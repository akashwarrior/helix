import { WorkBench as WorkBenchComponent } from "@/components/workbench";
import { getFilesFromS3 } from "@/lib/s3";
import { createSandbox } from "@/lib/sandbox";
import type { Sandbox } from "@vercel/sandbox";

export async function WorkBench({ chatId }: { chatId: string }) {
  const files = await getFilesFromS3(chatId);
  let sandbox: Sandbox | null = null;
  let domain: string | undefined = undefined;

  if (files.length > 0) {
    sandbox = await createSandbox(chatId, files);
    domain = sandbox.domain(3000);
  }

  return (
    <WorkBenchComponent
      files={files}
      sandboxId={sandbox?.sandboxId}
      domain={domain}
    />
  );
}
