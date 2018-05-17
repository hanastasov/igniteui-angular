import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AvatarSampleComponent } from "./avatar/sample.component";
import { BadgeSampleComponent } from "./badge/sample.component";
import { ButtonsSampleComponent } from "./button/sample.component";
import { ButtonGroupSampleComponent } from "./buttonGroup/sample.component";
import { IgxCalendarSampleComponent } from "./calendar/sample.component";
import { IgxCardSampleComponent } from "./card/sample.component";
import { IgxTimePickerSampleComponent } from "./time-picker/sample.component";
import { CarouselSampleComponent } from "./carousel/sample.component";
import { IgxDatePickerSampleComponent } from "./date-picker/sample.component";
import { DialogSampleComponent } from "./dialog/sample.component";
import { MaskSampleComponent } from "./directives/mask/sample.component";
import { GridToolbarSampleComponent } from "./grid-toolbar/sample.component"
import { GridColumnPinningSampleComponent } from "./grid-column-pinning/sample.component";
import { GridColumnResizingSampleComponent } from "./grid-column-resizing/sample.component"
import { GridPerformanceSampleComponent } from "./grid-performance/sample.component";
import { GridSelectionComponent } from "./grid-selection/sample.component";
import { GridSummaryComponent } from "./grid-summaries/sample.component";
import { GridSampleComponent } from "./grid/sample.component";
import { GridVirtualizationSampleComponent } from "./grid-remote-virtualization/sample.component";
import { IconSampleComponent } from "./icon/sample.component";
import { InputGroupSampleComponent } from "./input-group/input-group.component";
import { InputSampleComponent } from "./input/sample.component";
import { LayoutSampleComponent } from "./layout/sample.component";
import { ListPerformanceSampleComponent } from "./list-performance/sample.component";
import { ListSampleComponent } from "./list/sample.component";
import { NavbarSampleComponent } from "./navbar/sample.component";
import { NavdrawerSampleComponent } from "./navdrawer/sample.component";
import { ProgressbarSampleComponent } from "./progressbar/sample.component";
import { RippleSampleComponent } from "./ripple/sample.component";
import { IgxSliderSampleComponent } from "./slider/sample.component";
import { IgxSnackbarSampleComponent } from "./snackbar/sample.component";
import { IgxColorsSampleComponent } from "./styleguide/colors/sample.component";
import { IgxShadowsSampleComponent } from "./styleguide/shadows/sample.component";
import { IgxTypographySampleComponent } from "./styleguide/typography/sample.component";
import {
    CustomContentComponent,
    TabBarSampleComponent
} from "./tabbar/sample.component";
import {
    TabsSampleComponent
} from "./tabs/sample.component";
import { IgxToastSampleComponent } from "./toast/sample.component";
import { VirtualForSampleComponent } from "./virtual-for-directive/sample.component";

const appRoutes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "/avatar"
    },
    {
        component: InputSampleComponent,
        path: "inputs"
    },
    {
        component: CarouselSampleComponent,
        path: "carousel"
    },
    {
        component: TabBarSampleComponent,
        path: "tabbar"
    },
    {
        component: TabsSampleComponent,
        path: "tabs"
    },
    {
        component: ButtonsSampleComponent,
        path: "buttons"
    },
    {
        component: ButtonGroupSampleComponent,
        path: "buttonGroup"
    },
    {
        component: ListSampleComponent,
        path: "list"
    },
    {
        component: AvatarSampleComponent,
        path: "avatar"
    },
    {
        component: NavbarSampleComponent,
        path: "navbar"
    },
    {
        component: NavdrawerSampleComponent,
        path: "navdrawer"
    },
    {
        component: ProgressbarSampleComponent,
        path: "progressbar"
    },
    {
        component: IgxSnackbarSampleComponent,
        path: "snackbar"
    },
    {
        component: IgxToastSampleComponent,
        path: "toast"
    },
    {
        component: DialogSampleComponent,
        path: "dialog"
    },
    {
        component: InputGroupSampleComponent,
        path: "input-group"
    },
    {
        component: IconSampleComponent,
        path: "icon"
    },
    {
        component: GridSampleComponent,
        path: "grid"
    },
    {
        component: GridToolbarSampleComponent,
        path: "gridToolbar"
    },
    {
        component: GridColumnPinningSampleComponent,
        path: "gridColumnPinning"
    },
    {
        component: GridColumnResizingSampleComponent,
        path: "gridColumnResizing"
    },
    {
        component: GridPerformanceSampleComponent,
        path: "gridPerformance"
    },
    {
        component: GridSummaryComponent,
        path: "gridSummary"
    },
    {
        component: GridSelectionComponent,
        path: "gridSelection"
    },
    {
        component: IgxCardSampleComponent,
        path: "card"
    },
    {
        component: IgxSliderSampleComponent,
        path: "slider"
    },
    {
        component: BadgeSampleComponent,
        path: "badge"
    },
    {
        component: RippleSampleComponent,
        path: "ripple"
    },
    {
        component: IgxColorsSampleComponent,
        path: "colors"
    },
    {
        component: IgxTypographySampleComponent,
        path: "typography"
    },
    {
        component: IgxShadowsSampleComponent,
        path: "shadows"
    },
    {
        component: IgxCalendarSampleComponent,
        path: "calendar"
    },
    {
        component: IgxDatePickerSampleComponent,
        path: "datePicker"
    },
    {
        component: LayoutSampleComponent,
        path: "layout"
    },
    {
        component: ListPerformanceSampleComponent,
        path: "listPerformance"
    },
    {
        component: VirtualForSampleComponent,
        path: "virtualForDirective"
    },
    {
        component: IgxTimePickerSampleComponent,
        path: "timePicker"
    },
    {
        component: MaskSampleComponent,
        path: "mask"
    },
    {
        component: GridVirtualizationSampleComponent,
        path: "gridRemoteVirtualization"
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
