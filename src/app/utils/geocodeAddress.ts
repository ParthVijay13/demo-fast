export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const params = new URLSearchParams({
    address,
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API!,
  });

  const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`);
  const data = await res.json();
  if (data.status === 'OK' && data.results.length) {
    return data.results[0].geometry.location;
  }
  return null;
}
