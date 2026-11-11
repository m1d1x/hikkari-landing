import { redirect } from '@sveltejs/kit';

// The subscription page moved into the home page section: old links land there.
export const load = () => {
	redirect(308, '/#pricing');
};
