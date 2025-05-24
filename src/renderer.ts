import './index.css';
import './app/app';

declare global {
    interface Window {
        electronApi?: {
            openUrl: (url: string) => Promise<void>;
        }
    }
}
