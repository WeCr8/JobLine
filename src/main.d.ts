import './style.css';
declare global {
    interface Window {
        isPlatform: {
            ios: boolean;
            android: boolean;
        };
        installPWA: () => void;
    }
}
