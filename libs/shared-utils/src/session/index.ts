export function setSession(key: string, value: unknown) {
    if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem(key, JSON.stringify(value));
    }
}

export function getSession(key: string) {
    if (typeof sessionStorage !== "undefined") {
        return sessionStorage.getItem(key);
    }
    return "";
}
