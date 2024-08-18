if (typeof browser === "undefined") {
	var browser = chrome;
}

class Kpfb {
	static #FB_URL = "https://flicksbar.mom";
	static #PARENT1() {
		return document.querySelector(
			"html > body > div > div > div:nth-of-type(2) > main > div > div:nth-of-type(2) > div > div:nth-of-type(3) > div > div > div > div > div > div:nth-of-type(2) > div:nth-of-type(2) > div"
		);
	}
	static #PARENT2() {
		return document.querySelector(
			"html > body > div > div > div:nth-of-type(2) > main > div > div:nth-of-type(2) > div > div:nth-of-type(3) > div > div > div > div > div > div:nth-of-type(2) > div"
		);
	}
	static #PARENT3() {
		return document.querySelector(
			"html > body > div > div > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(3) > div > div > div > div > div > div:nth-of-type(2) > div"
		);
	}
	static #PARENT4() {
		return document.querySelector(
			"html > body > div > div > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div:nth-of-type(3) > div > div > div > div > div > div:nth-of-type(2) > div > div:nth-of-type(2) > div"
		);
	}

	static #PARENT() {
		return (
			this.#PARENT1() ??
			this.#PARENT2() ??
			this.#PARENT3() ??
			this.#PARENT4()
		);
	}

	static #BUTTON_ONCLICK() {
		try {
			const kpUrl = window.location.href;

			browser.runtime.sendMessage({
				command: "openFb",
				url: Kpfb.getFbLink(kpUrl),
			});
		} catch (e) {
			console.error(e);
		}
	}

	static #getFilmId(url) {
		let film = url.pathname.toString();

		if (!film) {
			throw "Error(KPFB): Failed to find film id";
		}

		return film;
	}

	static #createFbLink(film) {
		return this.#FB_URL + film;
	}

	// Must handle exceptions when calling this methode
	static getFbLink(kpUrl) {
		try {
			kpUrl = new URL(kpUrl);
			const film = this.#getFilmId(kpUrl);

			return this.#createFbLink(film);
		} catch (e) {
			throw e;
		}
	}

	static createButton() {
		const button_id = "KPFB";

		if (document.getElementById(button_id)) {
			return;
		}

		// Button
		const kpfb_button = document.createElement("img");
		kpfb_button.id = button_id;
		kpfb_button.style.width = "48px";
		kpfb_button.style.height = "48px";
		// kpfb_button.style.paddingRight = "10px";
		kpfb_button.title = "Watch on Flicksbar";

		const img = browser.runtime.getURL("icons/kpfb-48.png");
		kpfb_button.src = img;

		kpfb_button.onclick = this.#BUTTON_ONCLICK;

		const parent = this.#PARENT();
		parent.appendChild(kpfb_button);
	}
}

function main() {
	Kpfb.createButton();

	// To fix button persistence after redirect
	// Create button after site redirecting
	const observer = new MutationObserver(() => {
		Kpfb.createButton();
	});
	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});

	// Fallback for page navigation or if the page is dynamically updated
	window.addEventListener("load", Kpfb.createButton);
}

// Call main()
main();
