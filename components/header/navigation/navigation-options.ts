import { Icons } from "@/components/ui/icons";
import {
	DOCS_PAGE,
	FLEX_PCB_FAB_PAGE,
	HOW_TO_GUIDES_PAGE,
	HOME_PAGE,
	PCB_ASSEMBLY_PAGE,
	PCB_TECH_CAPABILITIES_PAGE,
	RIGID_PCB_FAB_PAGE,
} from "@/lib/constants/page-routes";

export const navigationOptions = [
	{
		id: 1,
		name: "Linh kiện",
		href: HOME_PAGE,
		icon: Icons.BsCpu,
		testid: "components-nav-link",
	},
	{
		id: 2,
		name: "Mạch in Cứng",
		href: RIGID_PCB_FAB_PAGE,
		icon: Icons.TfiLayers,
		testid: "rigid-pcb-nav-link",
	},
	{
		id: 3,
		name: "Mạch in Dẻo",
		href: FLEX_PCB_FAB_PAGE,
		icon: Icons.CgDisplayFlex,
		testid: "flex-pcb-nav-link",
	},
	{
		id: 4,
		name: "Lắp ráp PCB",
		href: PCB_ASSEMBLY_PAGE,
		icon: Icons.GiFlexibleLamp,
		testid: "pcb-assembly-nav-link",
	},
	{
		id: 5,
		name: "Năng lực Kỹ thuật",
		href: PCB_TECH_CAPABILITIES_PAGE,
		icon: Icons.BsRocket,
		testid: "tech-capabilities-nav-link",
	},
	{
		id: 6,
		name: "Hướng dẫn",
		href: HOW_TO_GUIDES_PAGE,
		icon: Icons.GiHelp,
		target: "_blank",
		testid: "how-to-guides-nav-link",
	},
	{
		id: 7,
		name: "Tài liệu",
		href: DOCS_PAGE,
		icon: Icons.IoMdDocument,
		target: "_blank",
		testid: "docs-nav-link",
	},
];
