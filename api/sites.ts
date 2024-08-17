import { API_URL } from "../utils/constants";

export async function getSites(): Promise<string[]> {
    return fetch(`${API_URL}/api/sites`).then(resp => resp.json());
}