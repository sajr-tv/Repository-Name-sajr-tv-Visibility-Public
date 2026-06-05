export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new Response("Missing url", { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "*/*",
        "Referer": new URL(targetUrl).origin + "/",
        "Origin": new URL(targetUrl).origin,
      },
    });

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("mpegurl") || targetUrl.includes(".m3u8")) {
      let playlist = await response.text();
      const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf("/") + 1);

      playlist = playlist.replace(/URI="([^"]+)"/g, function (match, uri) {
        let absoluteUrl = uri;

        if (!uri.startsWith("http")) {
          absoluteUrl = new URL(uri, baseUrl).href;
        }

        return `URI="/api/stream?url=${encodeURIComponent(absoluteUrl)}"`;
      });

      playlist = playlist.replace(/^(?!#)(.+)$/gm, function (line) {
        const cleanLine = line.trim();

        if (!cleanLine) return cleanLine;

        let absoluteUrl = cleanLine;

        if (!cleanLine.startsWith("http")) {
          absoluteUrl = new URL(cleanLine, baseUrl).href;
        }

        return `/api/stream?url=${encodeURIComponent(absoluteUrl)}`;
      });

      return new Response(playlist, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache",
        },
      });
    }

    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      status: response.status,
      headers: {
        "Content-Type": contentType || "application/octet-stream",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    return new Response("Stream error: " + error.message, { status: 500 });
  }
}