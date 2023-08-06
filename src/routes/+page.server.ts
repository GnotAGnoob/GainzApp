import { timeout } from '$lib';

export async function load() {
    // await timeout(1000);
    console.log('load');

    return {
        test: 'test'
    };
}