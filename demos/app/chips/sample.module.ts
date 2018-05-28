import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { IgxChipsAreaModule, IgxIconModule } from "../../lib/main";
import { PageHeaderModule } from "../pageHeading/pageHeading.module";
import { IgxChipsSampleComponent } from "./sample.component";
import { IgxDragDropModule } from "../../lib/directives/dragdrop/dragdrop.directive";

@NgModule({
    declarations: [IgxChipsSampleComponent],
    imports: [IgxChipsAreaModule, IgxIconModule, CommonModule, PageHeaderModule]
})
export class IgxChipsSampleModule { }
