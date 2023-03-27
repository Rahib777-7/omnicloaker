class Omnicloaker {
	static ninjaStatus = false;
	static documentTitle;
	static documentIcon;
	static documentGrab = false;
	static cloakTitle;
	static cloakIcon;
	static cloakGrab = false;

	static cloak(config) {
		Omnicloaker.#validateConfig(config);

		if (config["ninja"]) {
			Omnicloaker.ninjaStatus = !!config["ninja"] /* !! converts anything into a Boolean */;
			if (config["ninja"]["title"]) {
				Omnicloaker.documentTitle = config["ninja"]["title"];
			}
			if (config["ninja"]["icon"]) {
				Omnicloaker.documentIcon = config["ninja"]["icon"];
			}
			if (config["ninja"]["grab"] !== undefined) {
				Omnicloaker.documentGrab = config["ninja"]["grab"];
			}
			if (document.visibilityState === "hidden") {
				return;
			}
		}

		if (config["grab"] !== undefined) {
			Omnicloaker.cloakGrab = config["grab"];
		}

		if (config["title"]) {
			Omnicloaker.setTitle(config["title"]);
			Omnicloaker.cloakTitle = config["title"];
		}

		if (config["icon"]) {
			Omnicloaker.setIcon(config["icon"], config["grab"]);
			Omnicloaker.cloakIcon = config["icon"];
		}
	}

	static setIcon(url, grab = false) {
		let icon = document.querySelector("link[rel=icon]");
		if (!icon) {
			icon = document.createElement("link");
			icon.rel = "icon";
			document.head.appendChild(icon);
		}
		if (grab) {
			/* If the user wants to grab an icon */
			icon.type = "image/x-icon";
			icon.href = `https://www.google.com/s2/favicons?domain=${url}`;
		} else {
			let fileType = Omnicloaker.#fileEnding(url).toLowerCase();
			const fileTypes = {
				png: "image/png",
				jpg: "image/jpeg",
				jpeg: "image/jpeg",
				svg: "image/svg+xml",
				ico: "image/x-icon",
				gif: "image/gif"
			};
			if (fileTypes[fileType] !== undefined) {
				icon.type = fileTypes[fileType];
			} else {
				throw new Error(`Omnicloaker icon file type is invalid! Accepted file types: ${Object.keys(fileTypes)}`);
			}
			icon.href = url;
		}
	}

	static setTitle(titleText) {
		let title = document.querySelector("title");
		if (!title) {
			title = document.createElement("title");
			document.head.appendChild(title);
		}
		title.textContent = titleText;
	}

	static #validateConfig(config) {
		if (typeof config !== "object") {
			throw new Error("Omnicloaker configuration is not an object!");
		}
		if (config["ninja"]) {
			if (typeof config["ninja"] !== "object") {
				throw new Error("Omnicloaker ninja is not a boolean!");
			}
			if (config["ninja"]["title"] && typeof config["ninja"]["title"] !== "string") {
				throw new Error("Omnicloaker ninja default title is not a boolean!");
			}
			if (config["ninja"]["icon"] && typeof config["ninja"]["icon"] !== "string") {
				throw new Error("Omnicloaker ninja default favicon is not a boolean!");
			}
			if (config["ninja"]["grab"] !== undefined && typeof config["ninja"]["grab"] !== "boolean") {
				throw new Error("Omnicloaker ninja default favicon is not a boolean!");
			}
			if (!config["ninja"]["icon"] && !config["ninja"]["title"]) {
				throw new Error("Omnicloaker ninja configuration has no favicon or title!");
			}
		}
		if (config["grab"] !== undefined && typeof config["grab"] !== "boolean") {
			throw new Error("Omnicloaker grab configuration is not a boolean!");
		}
		if (config["grab"] !== undefined && !config["icon"]) {
			throw new Error("Omnicloaker grab configuration must have a site URL to grab icon from!");
		}
		if (config["title"] && typeof config["title"] !== "string") {
			throw new Error("Omnicloaker title is not a string!");
		}
		if (config["icon"] && typeof config["icon"] !== "string") {
			throw new Error("Omnicloaker favicon link is not a string!");
		}
		if (!config["icon"] && !config["title"]) {
			throw new Error("Omnicloaker configuration has no favicon or title!");
		}
	}

	static #fileEnding(path) {
		let splitPath = path.split(".");
		if (!splitPath[splitPath.length - 1]) {
			throw new Error("Path given doesn't have a file ending!");
		}
		return splitPath[splitPath.length - 1];
	}
}
(() => {
	document.addEventListener("visibilitychange", () => {
		if (!Omnicloaker.ninjaStatus) {
			return;
		}
		if (Omnicloaker.documentTitle) {
			if (document.visibilityState === "visible") {
				Omnicloaker.setTitle(Omnicloaker.cloakTitle);
			} else if (document.visibilityState === "hidden") {
				Omnicloaker.setTitle(Omnicloaker.documentTitle);
			}
		}
		if (Omnicloaker.documentIcon) {
			if (document.visibilityState === "visible") {
				Omnicloaker.setIcon(Omnicloaker.cloakIcon, Omnicloaker.cloakGrab);
			} else if (document.visibilityState === "hidden") {
				Omnicloaker.setIcon(Omnicloaker.documentIcon, Omnicloaker.documentGrab);
			}
		}
	});
})();
