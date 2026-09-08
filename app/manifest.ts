import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NeuraOps Technologies",
    short_name: "NeuraOps",
    description:
      "Digital products, workflow automation, and AI systems for growing businesses.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfaf7",
    theme_color: "#fbfaf7",
    icons: [
      {
        src: "/media/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/media/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
