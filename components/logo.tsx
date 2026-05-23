import React from "react";

export function VichipLogo({ className = "", light = false }: { className?: string; light?: boolean }) {
	return (
		<div className={`flex items-center space-x-2 ${className}`}>
			<svg
				width="32"
				height="32"
				viewBox="0 0 32 32"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="text-[#00A651]"
			>
				{/* Outer chip body */}
				<rect x="4" y="4" width="24" height="24" rx="6" stroke="currentColor" strokeWidth="2.5" fill="none" />
				{/* Corner accents */}
				<rect x="10" y="10" width="12" height="12" rx="3" fill="currentColor" fillOpacity="0.15" />
				{/* Inner chip core */}
				<rect x="12" y="12" width="8" height="8" rx="2" fill="currentColor" />
				{/* Connection lines / Pins */}
				<path d="M16 2v2M16 28v2M2 16h2M28 16h2M11 2v2M21 2v2M11 28v2M21 28v2M2 11h2M2 21h2M28 11h2M28 21h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
			</svg>
			<span className={`text-xl font-bold tracking-tight font-heading ${light ? 'text-white' : 'text-[#1E1E1E] dark:text-white'}`}>
				VICHIP<span className="text-[#00A651]">.</span>
			</span>
		</div>
	);
}

// Keep legacy for compatibility but render the new Vichip logo inside it
export function CircuitPartsLogo() {
	return <VichipLogo />;
}
