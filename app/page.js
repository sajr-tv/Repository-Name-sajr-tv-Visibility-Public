"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const channels = [
  {
    number: "001",
    name: "Red Bull TV",
    category: "Sports / Adventure",
    type: "hls",
    url: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master_3360.m3u8",
  },
  {
    number: "002",
    name: "Court TV",
    category: "News / Crime",
    type: "hls",
    url: "https://content.uplynk.com/channel/6c0bd0f94b1d4526a98676e9699a10ef.m3u8",
  },
  {
    number: "003",
    name: "Discover Pakistan",
    category: "Pakistan / Travel",
    type: "hls",
    url: "https://livecdn.live247stream.com/discoverpakistan/tv/playlist.m3u8",
  },
{
  number: "004",
  name: "Geo News",
  category: "Pakistan News",
  type: "hls",
  url: "https://jk3lz82elw79-hls-live.5centscdn.com/GEONEWS/75810ad1df1beb09072aaac7df49b110.sdp/chunks.m3u8",
},
{
  number: "005",
  name: "ARY News",
  category: "Pakistan News",
  type: "hls",
  url: "https://arynews.aryzap.com/0ca4ea835f9910c0ec602b7801a8e978/6a244486/v1/0183ea205add0b8ed5941a38bc6f/0183ea20909b0b8ed5aa4d793456/ARYNewsH264_360p.m3u8?uuid=e6fc9792-30fb-48e3-b6df-35fab4f1d389&isSubM3u8=1",
},
{
  number: "006",
  name: "ARY Digital",
  category: "Pakistan Entertainment",
  type: "hls",
  url: "https://arydigital.aryzap.com/9efb4e4f66ebc5ed1842661b9a4bc4d1/6a2447f9/v1/0183ea2408f90b8ed5941a38bc72/0183ea24302d0b8ed5941a38bc75/ARYDigitalHDh264_360p.m3u8?uuid=cfe9107d-cdff-440a-8394-68971d4ea24e&isSubM3u8=1",
},
{
  number: "007",
  name: "Geo Entertainment",
  category: "Pakistan Entertainment",
  type: "hls",
  url: "https://jk3lz82elw79-hls-live.5centscdn.com/harPalGeo/955ad3298db330b5ee880c2c9e6f23a0.sdp/chunks.m3u8",
},
{
  id: "008",
  name: "Hum News",
  type: "embed",
  embedUrl: "https://www.youtube.com/embed/cleNtpjod6Q?autoplay=1&mute=1",
  category: "News"
},
{
  number: "009",
  name: "Al Jazeera English",
  type: "embed",
  embedUrl: "https://www.youtube.com/embed/live_stream?channel=UCNye-wNBqNL5ZzHSJj3l8Bg"
},
{
  number: "010",
  name: "Sky News",
  type: "embed",
  embedUrl: "https://www.youtube.com/embed/YDvsBbKfLPA"
},
{
  number: "011",
  name: "DW News",
  type: "embed",
  embedUrl: "https://www.youtube.com/embed/LuKwFajn37U"
},
{
  number: "012",
  name: "France 24 English",
  type: "embed",
  embedUrl: "https://www.youtube.com/embed/live_stream?channel=UCQfwfsi5VrQ8yKZ-UWmAEFg"
},
{
  number: "013",
  name: "TRT World",
  type: "embed",
  embedUrl: "https://www.youtube.com/embed/oNUi_iXNPeo"
},
{
  number: "014",
  name: "Bloomberg TV",
  type: "embed",
  embedUrl: "https://www.youtube.com/embed/iEpJwprxDdk"
},
{
  number: "015",
  name: "CGTN",
  type: "embed",
  embedUrl: "https://www.youtube.com/embed/fhWaJi1Hsfo"
},
{
  number: "016",
  name: "CBS News",
  type: "embed",
  embedUrl: "https://www.youtube.com/embed/ZlT7vyFF5cY"
},
{
  number: "018",
  name: "Star Plus",
  category: "Indian Entertainment",
  type: "embed",
  embedUrl: "https://www.yupptv.com/yupptvnew/channels/star-plus/live/embed"
},
{
  number: "019",
  name: "Colors TV",
  category: "Indian Entertainment",
  type: "embed",
  embedUrl: "https://www.yupptv.com/yupptvnew/channels/colors/live/embed"
},
{
  number: "022",
  name: "Star Plus US HD",
  category: "Indian Entertainment",
  type: "embed",
  embedUrl: "https://www.yupptv.com/yupptvnew/channels/star-plus-us-hd/live/embed"
},
{
  number: "023",
  name: "Colors Kannada",
  category: "Indian Entertainment",
  type: "embed",
  embedUrl: "https://www.yupptv.com/yupptvnew/channels/colors-kannada/live/embed"
},
{
  number: "020",
  name: "Zee TV",
  category: "Indian Entertainment",
  type: "embed",
  embedUrl: "https://www.yupptv.com/yupptvnew/channels/zee-tv/live/embed"
},
{
  number: "021",
  name: "Zee Cinema",
  category: "Indian Movies",
  type: "embed",
  embedUrl: "https://www.yupptv.com/yupptvnew/channels/zee-cinema/live/embed"
},
{
  number: "025",
  name: "Kiddo",
  category: "Kids",
  type: "embed",
  embedUrl: "https://www.yupptv.com/fast-tv/kiddo/live"
},
];

export default function Home() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [currentChannel, setCurrentChannel] = useState(channels[0]);

  useEffect(() => {
    if (!videoRef.current || !currentChannel || currentChannel.type !== "hls") return;

    const streamUrl = `/api/stream?url=${encodeURIComponent(currentChannel.url)}`;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play().catch(() => {});
      });

      return () => hls.destroy();
    } else {
      videoRef.current.src = streamUrl;
      videoRef.current.play().catch(() => {});
    }
  }, [currentChannel]);

  return (
    <main style={{ minHeight: "100vh", background: "#050505", color: "white", fontFamily: "Arial", padding: 24 }}>
      <h1 style={{ fontSize: 42, marginBottom: 4 }}>SAJR TV</h1>
      <p style={{ color: "#aaa", marginBottom: 25 }}>Live global channels streaming now</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
        <section style={{ background: "#111", padding: 18, borderRadius: 14, border: "1px solid #222" }}>
          <h2>{currentChannel.number} — {currentChannel.name}</h2>
          <p style={{ color: "#00ff88", fontWeight: "bold" }}>● LIVE</p>

          {currentChannel.type === "hls" && (
            <video ref={videoRef} controls autoPlay style={{ width: "100%", background: "black", borderRadius: 12 }} />
          )}

       {currentChannel.type === "embed" && (
  <div
    style={{
      height: "520px",
      overflow: "hidden",
      borderRadius: 12,
      background: "black"
    }}
  >
    <iframe
      src={currentChannel.embedUrl}
      style={{
        width: "100%",
        height: currentChannel.embedUrl?.includes("yupptv.com") ? "620px" : "520px",
        background: "black",
        border: "none"
      }}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    />
  </div>
)}
        </section>

        <aside style={{ background: "#111", padding: 16, borderRadius: 14, border: "1px solid #222" }}>
          <h3>Channels</h3>

          {channels.map((channel) => (
            <button
              key={channel.name}
              onClick={() => setCurrentChannel(channel)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: 14,
                marginBottom: 10,
                background: currentChannel.name === channel.name ? "#00a86b" : "#1b1b1b",
                color: "white",
                border: "1px solid #333",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              <b>{channel.number} — {channel.name}</b>
              <br />
              <span style={{ color: "#ccc", fontSize: 13 }}>{channel.category}</span>
            </button>
          ))}

          <div style={{ marginTop: 20, padding: 12, background: "#080808", borderRadius: 10, color: "#aaa", fontSize: 13 }}>
            Total listed channels: {channels.length}
          </div>
        </aside>
      </div>
    </main>
  );
}