/**
 * Ready-made routing groups, copied from the client's built-in catalog
 * (`engine/core/presets/defaults.json`). In the app they arrive from the hub
 * and update without a release; the landing shows the bundled defaults.
 */
export type PresetIcon = 'sber' | 'yandexmusic' | 'wildberries';

export interface ServicePreset {
	id: PresetIcon;
	name: string;
	brand: string;
	domains: string[];
	processes: { windows: string[]; darwin: string[] };
	ips: string[];
}

export const presets: ServicePreset[] = [
	{
		id: 'sber',
		name: 'сбер',
		brand: '#21a038',
		domains: ['sberbank.ru', 'sber.ru', 'sberbank.com', 'online.sberbank.ru', 'sberdevices.ru'],
		processes: { windows: [], darwin: [] },
		ips: ['84.252.144.0/21', '185.157.96.0/22', '194.54.14.0/23']
	},
	{
		id: 'yandexmusic',
		name: 'яндекс музыка',
		brand: '#ffcc00',
		domains: ['music.yandex.ru', 'music.yandex.net', 'music.ya.ru', 'yandex.ru', 'yastatic.net'],
		processes: {
			windows: ['Яндекс Музыка.exe'],
			darwin: ['Яндекс Музыка', 'Яндекс Музыка Helper']
		},
		ips: ['5.255.255.0/24', '77.88.0.0/18', '87.250.224.0/19', '213.180.192.0/19']
	},
	{
		id: 'wildberries',
		name: 'wildberries',
		brand: '#cb11ab',
		domains: ['wildberries.ru', 'wb.ru', 'wbbasket.ru', 'wbstatic.net', 'wbcontent.net'],
		processes: { windows: [], darwin: [] },
		ips: ['185.62.200.0/22', '185.138.252.0/22']
	}
];
