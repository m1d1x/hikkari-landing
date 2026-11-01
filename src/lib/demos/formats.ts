/**
 * What the client actually imports (engine/core/profile, engine/core/subscription):
 * share links of these protocols, WireGuard/AmneziaWG configs and
 * subscription URLs (plain or base64 lists).
 */
export const formats = [
	'vless',
	'hysteria2',
	'amneziawg',
	'reality',
	'xhttp',
	'wireguard',
	'trojan',
	'shadowsocks'
] as const;
