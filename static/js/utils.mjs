export function getTextAfterLastBackslash(path) {
    const parts = path.split('\\');
    return parts[parts.length - 1];
}

