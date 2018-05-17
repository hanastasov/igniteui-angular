import { CommonModule } from "@angular/common";
import {
    AfterViewInit,
    Component,
    ElementRef,
    HostBinding,
    Input,
    NgModule,
    OnInit,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { IgxIconModule } from "../icon";

let NEXT_ID = 0;

export enum Size {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large"
}
/**
 * **Ignite UI for Angular Avatar** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/avatar.html)
 *
 * The Ignite UI Avatar provides an easy way to add an avatar icon to your application.  This icon can be an
 * image, someone's initials or a material icon from the google material icon set.
 *
 * Example:
 * ```html
 * <igx-avatar initials="MS" roundShape="true" size="large">
 * </igx-avatar>
 * ```
 */
@Component({
    selector: "igx-avatar",
    templateUrl: "avatar.component.html"
})
export class IgxAvatarComponent implements OnInit, AfterViewInit {
    @ViewChild("image")
    public image: ElementRef;

    @ViewChild("imageTemplate", { read: TemplateRef })
    protected imageTemplate: TemplateRef<any>;

    @ViewChild("initialsTemplate", { read: TemplateRef })
    protected initialsTemplate: TemplateRef<any>;

    @ViewChild("iconTemplate", { read: TemplateRef })
    protected iconTemplate: TemplateRef<any>;

    @HostBinding("attr.aria-label")
    public ariaLabel = "avatar";

    @HostBinding("attr.role")
    public role = "img";

    @HostBinding("class.igx-avatar")
    public cssClass = "igx-avatar";

    public roleDescription: string;
    private _size: string | Size = "small";

    @HostBinding("class.igx-avatar--rounded")
    @HostBinding("attr.id")
    @Input()
    public id = `igx-avatar-${NEXT_ID++}`;

    @Input()
    public roundShape = false;

    @Input()
    public color: string;

    @Input()
    public bgColor: string;

    @Input()
    public initials: string;

    @Input()
    public icon: string;

    @Input()
    public src: string;

    @Input()
    public get size(): string | Size {
        return this._size;
    }

    public set size(value: string | Size) {
        switch (value) {
            case "small":
            case "medium":
            case "large":
                this._size = value;
                break;
            default:
                this._size = "small";
        }
    }

    get template() {
        if (this.src) {
            return this.imageTemplate;
        }

        if (this.initials) {
            return this.initialsTemplate;
        }

        return this.iconTemplate;
    }

    constructor(public elementRef: ElementRef) { }

    public ngOnInit() {
        this.roleDescription = this.getRole();
    }

    public ngAfterViewInit() {
        this.elementRef.nativeElement.classList.add(`igx-avatar--${this._size}`);
    }

    private getRole() {
        if (this.initials) {
            return "initials type avatar";
        } else if (this.src) {
            return "image type avatar";
        } else {
            return "icon type avatar";
        }
    }
}

@NgModule({
    declarations: [IgxAvatarComponent],
    exports: [IgxAvatarComponent],
    imports: [CommonModule, IgxIconModule]
})
export class IgxAvatarModule { }
