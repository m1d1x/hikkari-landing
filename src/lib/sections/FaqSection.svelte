<script lang="ts">
	import { reveal } from '#lib/actions/reveal.ts';
	import Icon from '#lib/ui/Icon.svelte';

	const faq = [
		{
			q: 'нужна ли подписка hikkari?',
			a: 'нет. можно вставить подписку другого сервиса или ссылку на свой сервер: маршрутизация, готовые группы и автовыбор сервера работают и с ними. подписка hikkari добавляет движок протоколов и наши серверы.'
		},
		{
			q: 'какие ссылки и форматы поддерживаются?',
			a: 'ссылки vless (включая reality и xhttp), trojan, shadowsocks и hysteria2, конфиги wireguard и amneziawg, а также подписки по ссылке в виде обычного списка или в base64. можно вставить сразу несколько ссылок.'
		},
		{
			q: 'чем движок протоколов отличается от обычного клиента?',
			a: 'обычный клиент держится за один протокол: перестал он работать, и связи нет. hikkari держит наготове несколько протоколов, следит, какие работают прямо сейчас, и сам переводит соединение на рабочий.'
		},
		{
			q: 'можно ли пустить localhost и локальную сеть мимо vpn?',
			a: 'да. во вкладке ip добавьте адрес или подсеть в cidr-нотации, например 192.168.0.0/16 или 10.0.0.0/8, и этот трафик пойдёт напрямую. так же работают отдельные домены и приложения.'
		},
		{
			q: 'на каких системах работает?',
			a: 'на macos 10.15 и новее (apple silicon и intel) и на windows 10 и 11.'
		},
		{
			q: 'как обновляется приложение?',
			a: 'само: hikkari скачивает обновление в фоне и проверяет его цифровую подпись перед установкой.'
		}
	];
</script>

<section class="section" id="faq">
	<div class="container grid">
		<header class="head" data-reveal use:reveal>
			<h2>частые вопросы</h2>
			<p class="eyebrow">faq</p>
		</header>

		<div class="list" data-reveal use:reveal={80}>
			{#each faq as item (item.q)}
				<details>
					<summary>
						<span>{item.q}</span>
						<span class="chev icon-text"><Icon name="chevronDown" size={18} /></span>
					</summary>
					<p>{item.a}</p>
				</details>
			{/each}
		</div>
	</div>
</section>

<style>
	.grid {
		display: grid;
		grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
		gap: 72px;
		align-items: start;
	}

	h2 {
		font-size: clamp(32px, 3.6vw, 48px);
		font-weight: 600;
		line-height: 1.05;
		letter-spacing: -0.025em;
		text-wrap: balance;
	}

	.eyebrow {
		margin-top: 16px;
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.14em;
		color: var(--text-muted);
	}

	.list {
		border-top: 1px solid var(--border);
	}

	details {
		border-bottom: 1px solid var(--border);
	}

	summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		padding: 22px 4px;
		cursor: pointer;
		list-style: none;
		font-family: var(--font-mono);
		font-size: 15px;
		font-weight: 600;
		color: var(--text-secondary);
		transition: color var(--transition-hover);
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary:hover,
	details[open] summary {
		color: var(--text);
	}

	.chev {
		flex: none;
		display: grid;
		color: var(--text-muted);
		transition:
			transform var(--d-expand) var(--ease),
			color var(--transition-hover);
	}

	summary:hover .chev {
		color: var(--primary);
	}

	details[open] .chev {
		transform: rotate(180deg);
	}

	details p {
		max-width: 46em;
		padding: 0 4px 24px;
		font-size: 15px;
		line-height: 1.65;
		color: var(--text-muted);
	}

	@media (max-width: 960px) {
		.grid {
			grid-template-columns: minmax(0, 1fr);
			gap: 40px;
		}
	}
</style>
