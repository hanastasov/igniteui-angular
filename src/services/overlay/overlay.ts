import { DOCUMENT } from "@angular/common";
import {
    ApplicationRef,
    ComponentFactoryResolver,
    Inject,
    Injectable,
    Injector
} from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class IgxOverlayService {
    private _overlayElement: HTMLElement;
    private _attachedComponents: any[] = [];

    /**
     * Creates, sets up, and return a DIV HTMLElement attached to document's body
     */
    private get OverlayElement(): HTMLElement {
        if (!this._overlayElement) {
            this._overlayElement = this._document.createElement("div");

            // TODO: move the logic in the event listener in private method
            this._overlayElement.addEventListener("click", (event) => {
                let lastChild: Node = this._overlayElement.lastChild;
                while (lastChild) {
                    this._overlayElement.removeChild(lastChild);
                    lastChild = this._overlayElement.lastChild;
                }

                this._attachedComponents.forEach((component) => {
                    if (component.hostView) {
                        this._appRef.detachView(component.hostView);
                    }

                    component.destroy();
                });

                this._attachedComponents = [];
                this._overlayElement.style.display = "none";
            });

            this._overlayElement.style.position = "fixed";
            this._overlayElement.style.top = "0";
            this._overlayElement.style.left = "0";
            this._overlayElement.style.width = "100%";
            this._overlayElement.style.height = "100%";
            this._overlayElement.style.backgroundColor = "rgba(0,0,0,0.63)";
            this._overlayElement.style.display = "none";
            this._overlayElement.classList.add("overlay");
            this._document.body.appendChild(this._overlayElement);
        }

        return this._overlayElement;
    }

    constructor(
        private _factoryResolver: ComponentFactoryResolver,
        private _appRef: ApplicationRef,
        private _injector: Injector,
        @Inject(DOCUMENT) protected _document: any) {
    }

    public showComponent(component) {
        let dynamicFactory;
        try {
            dynamicFactory = this._factoryResolver.resolveComponentFactory(component);
        } catch (error) {
            // TODO: should we throw if component argument is not Component
            console.log(error);
            return;
        }

        this.OverlayElement.style.display = "block";
        const dynamicComponent = dynamicFactory.create(this._injector);
        this._attachedComponents.push(dynamicComponent);

        dynamicComponent.location.nativeElement.style.position = "absolute";
        dynamicComponent.location.nativeElement.style.top = "0px";
        dynamicComponent.location.nativeElement.style.left = "0px";
        dynamicComponent.location.nativeElement.style.backgroundColor = "white";
        dynamicComponent.location.nativeElement.style.overflowY = "auto";
        this._appRef.attachView(dynamicComponent.hostView);
        this._attachedComponents.push(dynamicComponent.hostView);
        this.OverlayElement.appendChild(dynamicComponent.location.nativeElement);
    }
}
