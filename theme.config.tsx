import { env } from "@/env";
import { PLATFORM_NAME } from "@/lib/constants/app";
import type { DocsThemeConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
	useNextSeoProps() {
		return {
			titleTemplate: `%s - ${PLATFORM_NAME} Docs`,
			description: `${PLATFORM_NAME} Docs`,
			openGraph: {
				type: "website",
				locale: "en_US",
				url: env.NEXT_PUBLIC_APP_URL,
				site_name: `${PLATFORM_NAME} Docs`,
			},
		};
	},
	logo: (
		<p
			style={{
				fontWeight: "bolder",
				fontSize: "1.5rem",
			}}>
			{PLATFORM_NAME} Docs
		</p>
	),
	project: {
		link: "https://github.com/circuitparts/store",
	},
	chat: {
		link: "https://discord.gg/B4CCqBEH",
	},
	darkMode: false,
	docsRepositoryBase: "https://github.com/circuitparts/store/tree/main/pages",
	sidebar: {
		defaultMenuCollapseLevel: 1,
	},
	footer: {
		text: (
			<span>
				© {new Date().getFullYear()}{" "}
				<a
					href="https://ele-store.netlify.app"
					target="_blank">
					ELE Store
				</a>
				.
			</span>
		),
	},
};

export default config;
