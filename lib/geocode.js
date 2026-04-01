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