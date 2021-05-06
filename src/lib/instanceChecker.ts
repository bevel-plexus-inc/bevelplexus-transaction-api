export function isInstanceOfError(data: any): boolean {
    if (!data) {
        return true;
    }

    return "error" in data;
}

export function isInstanceOfSuccess(data: any): boolean {
    return !("error" in data);
}
