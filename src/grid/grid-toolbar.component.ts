import {
    ChangeDetectorRef,
    Component,
    ContentChild,
    Directive,
    ElementRef,
    HostBinding,
    Input,
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
export class IgxGridToolbarComponent implements IGridBus {

    @HostBinding("class.igx-grid-toolbar")
    @Input()
    public gridID: string;





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

    public get shouldShowExportButton(): boolean {
        const igxGrid = this.gridAPI.get(this.gridID);
        return (igxGrid != null && (igxGrid.toolbarExportExcel || igxGrid.toolbarExportCsv));
    }

    public get shouldShowExportExcelButton(): boolean {
        const igxGrid = this.gridAPI.get(this.gridID);
        return igxGrid.toolbarExportExcel;
    }

    public get shouldShowExportCsvButton(): boolean {
        const igxGrid = this.gridAPI.get(this.gridID);
        return igxGrid.toolbarExportCsv;
    }






    // these three should be replaced with properties to set the text

    @ViewChild("btnColumnChooser", { read: ElementRef})
    public columnChooserButton: ElementRef;

    @ViewChild("btnAdvFiltering", { read: ElementRef})
    public advFilteringButton: ElementRef;
    @ViewChild("btnExport", { read: ElementRef})
    public exportButton: ElementRef;






    public get hiddenColumnsCount(): number {
        return 0;
    }




    constructor(public gridAPI: IgxGridAPIService,
                public cdr: ChangeDetectorRef,
                @Optional() public excelExporter: IgxExcelExporterService,
                @Optional() public csvExporter: IgxCsvExporterService) {
    }




    public getTitle(): string {
        const igxGrid = this.gridAPI.get(this.gridID);
        return igxGrid != null ? igxGrid.toolbarTitle : "";
    }

    public getExportText(): string {
        const igxGrid = this.gridAPI.get(this.gridID);
        return igxGrid != null ? igxGrid.exportText : "";
    }

    public getExportExcelText(): string {
        const igxGrid = this.gridAPI.get(this.gridID);
        return igxGrid != null ? igxGrid.exportExcelText : "";
    }

    public getExportCsvText(): string {
        const igxGrid = this.gridAPI.get(this.gridID);
        return igxGrid != null ? igxGrid.exportCsvText : "";
    }











    public columnChooserClicked() {
        console.log("@@@ igxGridToolbar.columnChooserClicked");
    }

    public advFilteringClicked() {
        console.log("@@@ igxGridToolbar.advFilteringClicked");
    }

    public exportClicked() {
        this.toggleDirective.collapsed = !this.toggleDirective.collapsed;
    }

    public exportToExcelClicked() {
        this.toggleDirective.collapsed = !this.toggleDirective.collapsed;
        const igxGrid = this.gridAPI.get(this.gridID);
        const args = { grid: igxGrid, exporter: this.excelExporter, type: "excel", cancel: false };
        igxGrid.onToolbarExporting.emit(args);
        if (args.cancel) return;
        this.toastComp.show();
        console.log(this.excelExporter);
        this.excelExporter.export(igxGrid, new IgxExcelExporterOptions("ExportedData"));
    }

    public exportToCsvClicked() {
        this.toggleDirective.collapsed = !this.toggleDirective.collapsed;
        const igxGrid = this.gridAPI.get(this.gridID);
        const args = { grid: igxGrid, exporter: this.csvExporter, type: "csv", cancel: false };
        igxGrid.onToolbarExporting.emit(args);
        if (args.cancel) return;
        this.toastComp.show();
        console.log(this.csvExporter);
        this.csvExporter.export(igxGrid, new IgxCsvExporterOptions("ExportedData", CsvFileTypes.CSV))
    }




    public get igxGridToolbarToastMessage() {
        return "Exporting starts...";
    }





}




