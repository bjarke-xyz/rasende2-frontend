import { API_URL, INTERNAL_API_URL } from "../utils/constants";
import { isServer } from "../utils/utils";

export async function getSites(): Promise<string[]> {
    const apiUrl = isServer() ? INTERNAL_API_URL : API_URL
    return fetch(`${apiUrl}/api/sites`).then(resp => resp.json());
}