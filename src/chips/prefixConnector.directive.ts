import { Directive, HostBinding } from "@angular/core";

@Directive({
    selector: "igx-prefix-connector,[igxPrefixConnector]"
})
export class IgxPrefixConnectorDirective {
    @HostBinding("class.igx-input-group__bundle-suffix")
    public defaultClass = true;
}
