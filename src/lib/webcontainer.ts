import type { WebContainer } from '@webcontainer/api';
import type { FileNode } from '@/lib/type';


export async function buildFileTree(container: WebContainer, dirPath: string = '.'): Promise<FileNode[]> {
    const files: FileNode[] = [];
    try {
        const entries = await container.fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = dirPath === '.' ? entry.name : `${dirPath}/${entry.name}`;

            if (entry.isDirectory()) {
                const children = await buildFileTree(container, fullPath);
                files.push({
                    name: entry.name,
                    type: 'folder',
                    path: fullPath,
                    children,
                });
            } else {
                files.push({
                    name: entry.name,
                    type: 'file',
                    path: fullPath,
                });
            }
        }
    } catch (readError) {
        console.error(`Error reading directory ${dirPath}:`, readError);
    }

    return files;
}


export async function executeCommand(
    container: WebContainer,
    command: string,
    args: string[] = []
): Promise<{ success: boolean, output: string, error: string | undefined, exitCode: number }> {
    try {
        const process = await container.spawn(command, args);

        let output = '';

        process.output.pipeTo(
            new WritableStream({
                write(data) {
                    output += data;
                },
            })
        );

        const exitCode = await process.exit;

        return {
            success: exitCode === 0,
            output: output.trim(),
            error: undefined,
            exitCode,
        };
    } catch (err) {
        return {
            success: false,
            output: '',
            error: err instanceof Error ? err.message : 'Unknown error',
            exitCode: 1,
        };
    }
}