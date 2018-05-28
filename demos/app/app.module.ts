import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
    IgxAvatarModule, IgxCheckboxModule, IgxIconModule, IgxInputGroupModule,
    IgxNavigationDrawerModule, IgxNavigationService, IgxRadioModule, IgxRippleModule, IgxSwitchModule
} from "../lib/main";
import { AppComponent } from "./app.component";
import { routing } from "./app.routing";
import { AvatarSampleModule } from "./avatar/sample.module";
import { BadgeSampleModule } from "./badge/sample.module";
import { ButtonSampleModule } from "./button/sample.module";
import { ButtonGroupSampleModule } from "./buttonGroup/sample.module";
import { IgxCalendarSampleModule } from "./calendar/sample.module";
import { IgxCardSampleModule } from "./card/sample.module";
import { CarouselSampleModule } from "./carousel/sample.module";
import { IgxDatePickerSampleModule } from "./date-picker/sample.module";
import { DialogSampleModule } from "./dialog/sample.module";
import { MaskSampleModule } from "./directives/mask/sample.module";
import { GridColumnPinningSampleModule } from "./grid-column-pinning/sample.module";
import { GridColumnResizingSampleModule } from "./grid-column-resizing/sample.module";
import { GridPerformanceSampleModule } from "./grid-performance/sample.module";
import { GridSummarySampleModule } from "./grid-summaries/sample.module";
import { GridSelectionModule } from "./grid-selection/sample.module";
import { GridSampleModule } from "./grid/sample.module";
import { GridVirtualizationSampleModule } from "./grid-remote-virtualization/sample.module";
import { IconSampleModule } from "./icon/sample.module";
import { InputGroupSampleModule } from "./input-group/sample.module";
import { InputSampleModule } from "./input/sample.module";
import { LayoutSampleModule } from "./layout/sample.module";
import { ListPerformanceSampleModule } from "./list-performance/sample.module";
import { ListSampleModule } from "./list/sample.module";
import { NavbarSampleModule } from "./navbar/sample.module";
import { NavdrawerSampleModule } from "./navdrawer/sample.module";
import { ProgressBarSampleModule } from "./progressbar/sample.module";
import { RippleSampleModule } from "./ripple/sample.module";
import { IgxSliderSampleModule } from "./slider/sample.module";
import { IgxSnackbarSampleModule } from "./snackbar/sample.module";
import { IgxColorsSampleModule } from "./styleguide/colors/sample.module";
import { IgxShadowsSampleModule } from "./styleguide/shadows/sample.module";
import { IgxTypographySampleModule } from "./styleguide/typography/sample.module";
import { TabBarSampleModule } from "./tabbar/sample.module";
import { TabsSampleModule } from "./tabs/sample.module";
import { IgxTimePickerSampleModule } from "./time-picker/sample.module";
import { IgxToastSampleModule } from "./toast/sample.module";
import { VirtualForSampleModule } from "./virtual-for-directive/sample.module";
import { IgxChipsSampleModule } from "./chips/sample.module";

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        routing,
        IgxNavigationDrawerModule,
        IgxRadioModule,
        IgxIconModule.forRoot(),
        IgxCheckboxModule,
        IgxInputGroupModule,
        IgxSwitchModule,
        IgxAvatarModule,
        InputSampleModule,
        CarouselSampleModule,
        TabBarSampleModule,
        TabsSampleModule,
        ListSampleModule,
        ButtonSampleModule,
        ButtonGroupSampleModule,
        AvatarSampleModule,
        NavdrawerSampleModule,
        NavbarSampleModule,
        ProgressBarSampleModule,
        IgxSnackbarSampleModule,
        IgxToastSampleModule,
        DialogSampleModule,
        InputGroupSampleModule,
        IconSampleModule,
        GridSampleModule,
        GridColumnPinningSampleModule,
        GridColumnResizingSampleModule,
        GridPerformanceSampleModule,
        GridSummarySampleModule,
        GridVirtualizationSampleModule,
        GridSelectionModule,
        IgxCardSampleModule,
        IgxSliderSampleModule,
        BadgeSampleModule,
        RippleSampleModule,
        IgxTypographySampleModule,
        IgxColorsSampleModule,
        IgxShadowsSampleModule,
        IgxCalendarSampleModule,
        IgxDatePickerSampleModule,
        IgxRippleModule,
        LayoutSampleModule,
        ListPerformanceSampleModule,
        VirtualForSampleModule,
        IgxTimePickerSampleModule,
        MaskSampleModule,
        IgxChipsSampleModule
    ],
    providers: [IgxNavigationService]
})
export class AppModule { }
