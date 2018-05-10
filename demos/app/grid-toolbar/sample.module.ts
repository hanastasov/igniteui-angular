import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
    IgxButtonModule,
    IgxCardModule,
    IgxCheckboxModule,
    IgxGridModule,
    IgxInputGroupModule,
    IgxRippleModule,
    IgxSnackbarModule,
    IgxSwitchModule,
    IgxToastModule
} from "../../lib/main";
import { GridToolbarSampleComponent } from "./sample.component";
import { PageHeaderModule } from "../pageHeading/pageHeading.module";

@NgModule({
    declarations: [
        GridToolbarSampleComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        IgxGridModule,
        IgxCardModule,
        IgxSnackbarModule,
        IgxSwitchModule,
        IgxToastModule,
        IgxCheckboxModule,
        IgxButtonModule,
        IgxRippleModule,
        IgxInputGroupModule,
        PageHeaderModule
    ]
})
export class GridToolbarSampleModule {}