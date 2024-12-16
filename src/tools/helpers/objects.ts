export const isCustomObject = (obj: unknown) =>
    obj !== null && typeof obj === 'object';
