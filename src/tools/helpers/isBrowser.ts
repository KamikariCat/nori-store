export function isBrowser() {
    return (
        typeof window !== 'undefined' &&
        typeof window.localStorage !== 'undefined'
    );
}
