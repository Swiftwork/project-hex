import {
	Color3,
	ILoadingScreen,
} from 'babylonjs';

const LoadingScreenTemplate = require('./LoadingScreen.pug');

export default class LoadingScreen implements ILoadingScreen {

	private loadingScreen: HTMLElement;
	private loadingText: string;
	private template: string;

	constructor(
		private renderingCanvas: HTMLCanvasElement,
		private backgroundColor: Color3
	) {}

	public displayLoadingUI(): void {
		if (this.loadingScreen)
			return;

		this.template = LoadingScreenTemplate({
			text: this.loadingText || 'Loading all the gooey goodness...',
			backgroundColor: this.backgroundColor.toHexString(),
			textColor: 0.33 * this.backgroundColor.r + 0.5 * this.backgroundColor.g + 0.16 * this.backgroundColor.b >= 0.5 ? 'black' : 'white',
		});

		this.loadingScreen = document.createElement("div");
		this.loadingScreen.id = "loading-screen";
		this.loadingScreen.innerHTML = this.template;
		this.resizeToCanvas();

		window.addEventListener("resize", this.resizeToCanvas);
		document.body.appendChild(this.loadingScreen);
		setTimeout( () => {
			this.loadingScreen.style.opacity = '1';
		}, 0);
	}

	public hideLoadingUI(): void {
		if (!this.loadingScreen) {
			return;
		}

		var onTransitionEnd = () => {
			if (!this.loadingScreen) {
				return;
			}

			document.body.removeChild(this.loadingScreen);
			window.removeEventListener("resize", this.resizeToCanvas);

			this.loadingScreen = null;
		}

		this.loadingScreen.style.opacity = '0';
		this.loadingScreen.addEventListener("transitionend", onTransitionEnd);
	}

	public set loadingUIText(text: string) {
		this.loadingText = text;
		document.querySelector('.loading figcaption').innerHTML = this.loadingText;
	}

	public get loadingUIBackgroundColor(): string {
		return this.backgroundColor.toHexString();
	}

	public set loadingUIBackgroundColor(color: string) {
		this.backgroundColor = Color3.FromHexString(color);
	}	

	private resizeToCanvas = () => {
		const canvasBounds = this.renderingCanvas.getBoundingClientRect();
		this.loadingScreen.style.left = canvasBounds.left + "px";
		this.loadingScreen.style.top = canvasBounds.top + "px";
		this.loadingScreen.style.width = canvasBounds.width + "px";
		this.loadingScreen.style.height = canvasBounds.height + "px";
	}
}