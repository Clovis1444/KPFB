if (typeof browser === "undefined") {
	var browser = chrome;
}

function openNewTab(url, index) {
	browser.tabs.create({
		url: url,
		index: index,
	});
}

function main() {
	browser.runtime.onMessage.addListener((message) => {
		if (message.command === "openFb") {
			browser.tabs.query(
				{ active: true, lastFocusedWindow: true },
				(tabs) => {
					openNewTab(message.url, tabs[0].index + 1);
					// use `url` here inside the callback because it's asynchronous!
				}
			);
		}
	});
}

// Call main()
main();
