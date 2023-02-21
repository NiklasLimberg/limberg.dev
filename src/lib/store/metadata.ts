import { writable } from 'svelte/store';
import type { Metadata } from '$lib/types/metadata';

export const metadata_store = writable<Metadata>();