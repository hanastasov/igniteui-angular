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

import { IgxButtonDirective } from "../directives/button/button.directive";
import { IgxToggleDirective } from "../directives/toggle/toggle.directive";
import { CsvFileTypes,
         IgxCsvExporterOptions,
         IgxCsvExporterService,
         IgxExcelExporterOptions,
         IgxExcelExporterService } from "../services/index";
import { IgxGridAPIService } from "./api.service";
import { autoWire, IGridBus } from "./grid.common";
import { IgxGridComponent } from "./grid.component";

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

    public get shouldShowColumnHiding(): boolean {
        // should check the grid's "columnHiding" property
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

    public get hiddenColumnsCount(): number {
        return 1;
    }

    private _exportEventSubscription;

    constructor(public gridAPI: IgxGridAPIService,
                public cdr: ChangeDetectorRef,
                @Optional() public excelExporter: IgxExcelExporterService,
                @Optional() public csvExporter: IgxCsvExporterService) {
    }

    public getTitle(): string {
        const igxGrid = this.gridAPI.get(this.gridID);
        return igxGrid != null ? igxGrid.toolbarTitle : "";
    }

    public getColumnHiddingText(): string {
        const igxGrid = this.gridAPI.get(this.gridID);
        // return igxGrid != null ? igxGrid.columnHiddingText : "";
        return "hidden";
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

    public exportClicked() {
        this.toggleDirective.collapsed = !this.toggleDirective.collapsed;
    }

    public exportToExcelClicked() {
        this.toggleDirective.collapsed = !this.toggleDirective.collapsed;
        const igxGrid = this.gridAPI.get(this.gridID);
        const args = { grid: igxGrid, exporter: this.excelExporter, type: "excel", cancel: false };
        igxGrid.onToolbarExporting.emit(args);
        if (args.cancel) {
            return;
        }
        this._exportEventSubscription = this.excelExporter.onExportEnded.subscribe((ev) => this._exportEndedHandler());
        // show busy indicator here
        this.excelExporter.export(igxGrid, new IgxExcelExporterOptions("ExportedData"));
    }

    public exportToCsvClicked() {
        this.toggleDirective.collapsed = !this.toggleDirective.collapsed;
        const igxGrid = this.gridAPI.get(this.gridID);
        const args = { grid: igxGrid, exporter: this.csvExporter, type: "csv", cancel: false };
        igxGrid.onToolbarExporting.emit(args);
        if (args.cancel) {
            return;
        }
        this._exportEventSubscription = this.csvExporter.onExportEnded.subscribe((ev) => this._exportEndedHandler());
        // show busy indicator here
        this.csvExporter.export(igxGrid, new IgxCsvExporterOptions("ExportedData", CsvFileTypes.CSV));
    }

    private _exportEndedHandler() {
        if (this._exportEventSubscription) {
            this._exportEventSubscription.unsubscribe();
        }
        // hide busy indicator here
    }

}
