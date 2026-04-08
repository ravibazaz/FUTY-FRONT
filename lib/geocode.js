const API_KEY = process.env.GOOGLE_API_KEY;

export async function getLatLng(postcode) {
    try {
        const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(postcode + ", UK")}&key=${API_KEY}`,
            {
                // Optional: cache control (Next.js 15 feature)
                cache: "force-cache", // or "no-store" if you want fresh
            }
        );

        const data = await res.json();

        if (data.status === "OK") {
            const { lat, lng } = data.results[0].geometry.location;
            return { lat, lng };
        }

        console.error("Geocoding error:", data.status, data.error_message);
        throw new Error(data.status);
    } catch (err) {
        console.error("Geocode failed:", err.message);
        throw err;
    }
}


export async function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // km

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}