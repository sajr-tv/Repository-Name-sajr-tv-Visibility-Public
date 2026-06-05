export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return Response.json({
      ok: false,
      error: "Missing URL",
    });
  }

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      cache: "no-store",
    });

    const text = await response.text();

    const isM3U =
      text.includes("#EXTM3U") ||
      text.includes("#EXT-X-STREAM-INF") ||
      text.includes("#EXTINF");

    return Response.json({
      ok: response.ok && isM3U,
      status: response.status,
      type: response.headers.get("content-type"),
    });
  } catch (error) {
    return Response.json({
      ok: false,
      error: error.message,
    });
  }
}