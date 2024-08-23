export function isServer() {
    return typeof window === "undefined"
}
export const truncateText = (text: string, maxLength = 160) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
};