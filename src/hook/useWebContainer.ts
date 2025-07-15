import { useEffect, useState } from 'react';
import { WebContainer } from '@webcontainer/api';
import { usePreviewUrlStore } from '@/store/previewUrlStore';

export interface UseWebContainerReturn {
    isReady: boolean;
    error: string | null;
    webContainer: WebContainer;
}

export function useWebContainer(): UseWebContainerReturn {
    const [webContainer, setWebContainer] = useState<WebContainer>();
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setPreviewUrl = usePreviewUrlStore(state => state.setPreviewUrl)

    useEffect(() => {
        let container: WebContainer;
        (async () => {
            try {
                setError(null);
                container = await WebContainer.boot()
                container.on('server-ready', (port, url) => setPreviewUrl(url));
                setWebContainer(container);
                setIsReady(true);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to initialize WebContainer');
                setIsReady(false);
            }
        })();

        return () => container.teardown();
    }, []);

    return {
        isReady,
        error,
        webContainer: webContainer!,
    };
}