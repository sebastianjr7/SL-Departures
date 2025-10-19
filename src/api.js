const BASE = "https://transport.integration.sl.se/v1/sites";

export async function getSites() {
    const url = `${BASE}?expand=false`;
    const res = await fetch(
                        url, 
                        { headers: { "accept": "application/json" } }
                        );
    if (!res.ok) {
        throw new Error(`Sites request failed: ${res.status}`);
    }
    return await res.json();
}

export async function getDepartures(siteId) {
    const url = `${BASE}/${encodeURIComponent(siteId)}/departures`;
    const res = await fetch(
                        url, 
                        { headers: { "accept": "application/json" } }
                        );
    if (!res.ok) {
        throw new Error(`Departures request failed: ${res.status}`);
    }
    const data = await res.json();
    if (!Array.isArray(data?.departures)) {
        return []
    }
    return data.departures
}