import {
    AfterContentInit,
    AfterViewInit,

    //ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    Directive,
    ElementRef, HostBinding,
    //HostBinding,
    //HostListener,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    TemplateRef,
    ViewChild
} from "@angular/core";


import { IgxGridAPIService } from "./api.service";
import { autoWire, IGridBus } from "./grid.common";
import { IgxButtonDirective } from "../directives/button/button.directive";
import { IgxGridComponent } from "./grid.component";
import { IgxToggleDirective } from "../directives/toggle/toggle.directive";
import { IgxToastComponent } from "../toast/toast.component";
import { IgxExcelExporterService, IgxExcelExporterOptions, IgxCsvExporterService, IgxCsvExporterOptions, CsvFileTypes } from "../services/index";





@Component({
    selector: "igx-grid-toolbar",
    templateUrl: "./grid-toolbar.component.html"
})
export class IgxGridToolbarComponent implements IGridBus, OnInit, OnDestroy, AfterViewInit {
    @HostBinding("class.igx-grid-toolbar")
    @Input()
    public gridID: string;



    public hasTitle(): boolean {
        const igxGrid = this.gridAPI.get(this.gridID);
        return (igxGrid != null && igxGrid.toolbarTitle != null);
    }

    public getTitle(): string {
        const igxGrid = this.gridAPI.get(this.gridID);
        //console.log("@@@ getTitle(): '" + igxGrid.toolbarTitle + "'");
        return igxGrid.toolbarTitle;
    }



    @ViewChild(IgxToggleDirective, { read: IgxToggleDirective })
    protected toggleDirective: IgxToggleDirective;


    @ViewChild(IgxToastComponent, { read: IgxToastComponent })
    protected toastComp: IgxToastComponent;




    public get showColumnChooserButton(): boolean {
        return true;
    }

    public get showAdvFilteringButton(): boolean {
        return true;
    }

    public get showExportButton(): boolean {
        return true;

        // const igxGrid = this.gridAPI.get(this.gridID);
        // if (igxGrid != null) {
        //     return igxGrid.showToolbarExport;
        // }
        // return false;
    }








    @ViewChild("btnColumnChooser", { read: ElementRef})
    public columnChooserButton: ElementRef;

    @ViewChild("btnAdvFiltering", { read: ElementRef})
    public advFilteringButton: ElementRef;


    @ViewChild("btnExport", { read: ElementRef})
    public exportButton: ElementRef;








    //@ViewChild("ttoolbar", { read: IgxGridToolbarComponent })
    //public toolbar: IgxGridToolbarComponent;



    public get hiddenColumnsCount(): number {
        return 0;
    }




    constructor(public gridAPI: IgxGridAPIService,
                public cdr: ChangeDetectorRef,
                @Optional() public excelExporter: IgxExcelExporterService,
                @Optional() public csvExporter: IgxCsvExporterService) {

        console.log("@@@ IgxGridToolbarComponent constructor");
        console.log("@@@ excelExporter:" + this.excelExporter);
        console.log("@@@ csvExporter:" + this.csvExporter);



    }



    public ngOnInit() {
        //const igxGrid = this.gridAPI.get(this.gridID);
        //console.log("@@@ igxGridToolbar.ngOnInit: " + igxGrid);

// subsribe to below
      //  @Output()
      //  public onColumnPinning = new EventEmitter<IPinColumnEventArgs>();


    //   this.chunkLoaded = this.gridAPI.get(this.gridID).headerContainer.onChunkPreload.subscribe(() => {
    //     if (!this.toggleDirective.collapsed) {
    //         this.toggleDirective.collapsed = true;
    //         this.refresh();
    //     }
    // });



    }

    public ngOnDestroy() {

        // unsubscribe from onColumnPinning
    }


    public ngAfterContentInit() {
        //console.log("@@@ igxGridToolbar.ngAfterContentInit: " + this.gridID);
    }

    public ngAfterViewInit() {
        //console.log("@@@ igxGridToolbar.ngAfterViewInit: " + this.gridID);
        this.cdr.detectChanges();
    }


















    public columnChooserClicked() {
        console.log("@@@ igxGridToolbar.columnChooserClicked");
    }

    public advFilteringClicked() {
        console.log("@@@ igxGridToolbar.advFilteringClicked");
    }




    public exportPopupOpened() {
        console.log("@@@ igxGridToolbar.exportPopupOpened");

    }

    public exportPopupClosed() {
        console.log("@@@ igxGridToolbar.exportPopupClosed");

    }









    public exportClicked() {
        console.log("@@@ igxGridToolbar.exportClicked");
        // toggle popup
        this.toggleDirective.collapsed = !this.toggleDirective.collapsed;
    }



    public exportToExcelClicked() {
        console.log("@@@ igxGridToolbar.exportToExcelClicked");
        this.toggleDirective.collapsed = !this.toggleDirective.collapsed;
        const igxGrid = this.gridAPI.get(this.gridID);
        const args = { grid: igxGrid, type: "excel", cancel: false };
        igxGrid.onToolbarExportClicked.emit(args);
        if (args.cancel) return;
        // toast here ...
        this.toastComp.show();
        console.log(this.excelExporter);
        this.excelExporter.export(igxGrid, new IgxExcelExporterOptions("ExportedData"));
    }

    public exportToCsvClicked() {
        console.log("@@@ igxGridToolbar.exportToCsvClicked");
        this.toggleDirective.collapsed = !this.toggleDirective.collapsed;
        const igxGrid = this.gridAPI.get(this.gridID);
        const args = { grid: igxGrid, type: "csv", cancel: false };
        igxGrid.onToolbarExportClicked.emit(args);
        if (args.cancel) return;
        // toast here ...
        this.toastComp.show();
        console.log(this.csvExporter);
        this.csvExporter.export(igxGrid, new IgxCsvExporterOptions("ExportedData", CsvFileTypes.CSV))
    }




    public get igxGridToolbarToastMessage() {
        return "Exporting starts...";
    }


/*
    @Output()
    public onToolbarExportToExcelClicked = new EventEmitter<IGridToolbarExportEventArgs>();

    @Output()
    public onToolbarExportToCsvClicked = new EventEmitter<IGridToolbarExportEventArgs>();
*/







}




