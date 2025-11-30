export const OWNCAST_API = 'http://localhost:8080';

export interface OwncastStatus {
    online: boolean;
    viewerCount: number;
    lastConnectTime?: string;
    streamTitle?: string;
}

export interface OwncastConfig {
    name: string;
    summary: string;
    tags: string[];
    logo: string;
}

export async function getOwncastStatus(): Promise<OwncastStatus> {
    try {
        const response = await fetch(`${OWNCAST_API}/api/status`);
        if (response.ok) {
            const data = await response.json();
            return {
                online: data.online,
                viewerCount: data.viewerCount,
                lastConnectTime: data.lastConnectTime,
                streamTitle: data.streamTitle,
            };
        }
    } catch (error) {
        console.error('Error fetching Owncast status:', error);
    }
    return { online: false, viewerCount: 0 };
}

export async function getOwncastConfig(): Promise<OwncastConfig> {
    try {
        const response = await fetch(`${OWNCAST_API}/api/config`);
        if (response.ok) {
            const data = await response.json();
            return {
                name: data.instanceDetails.name,
                summary: data.instanceDetails.summary,
                tags: data.instanceDetails.tags,
                logo: data.instanceDetails.logo,
            };
        }
    } catch (error) {
        console.error('Error fetching Owncast config:', error);
    }
    return { name: 'Owncast', summary: '', tags: [], logo: '' };
}
