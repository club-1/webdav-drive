import App from './App.svelte';
import { DummyFileSystem } from './model/FileSystem';

var app = new App({
	target: document.body,
	props: {
		fs: new DummyFileSystem()
	}
});

export default app;
