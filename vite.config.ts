/// <reference types="vitest" />
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
	base: "/dopamath/",
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["favicon.svg", "pwa-192x192.png", "pwa-512x512.png"],
			manifest: {
				name: "DopaMath",
				short_name: "DopaMath",
				description: "Math is the new Scroll.",
				theme_color: "#000000",
				background_color: "#000000",
				display: "standalone",
				icons: [
					{
						src: "pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
				],
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					"vendor-core": ["react", "react-dom", "react-router-dom"],
					"vendor-motion": ["framer-motion"],
					"vendor-charts": ["recharts"],
					"vendor-utils": ["lucide-react", "clsx", "tailwind-merge"],
				},
			},
		},
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/test/setup.ts",
	},
});
