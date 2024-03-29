import { fail, redirect } from '@sveltejs/kit';
import type { Action, Actions, PageServerLoad } from './$types';
import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const load: PageServerLoad = async ({ locals }) =>
{

	if (locals.user_id)
	{
		throw redirect(302, `/`);
	}

};

const login: Action = async ({ request, cookies }) =>
{

	const data = await request.formData();
	const { username, password } = Object.fromEntries(data);

	const url = `${PUBLIC_BACKEND_URL}/auth/login`;
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username,
			password
		})
	});

	const json = await res.json();

	if (res.ok && json.data.user && json.data.token)
	{
		cookies.set('user_id', json.data.user._id, {
			path: '/'
		});
		cookies.set('token', json.data.token, {
			path: '/'
		});
		throw redirect(303, `/`);
	}
	return fail(400, { message: json.message });
};

export const actions: Actions = {
	default: login
};
