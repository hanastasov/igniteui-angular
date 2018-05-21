import { EventEmitter, Injectable, Output } from "@angular/core";
import { IgxBaseExporter } from "../exporter-common/base-export-service";
import { ExportUtilities } from "../exporter-common/export-utilities";
import { CharSeparatedValueData } from "./char-separated-value-data";
import { CsvFileTypes, IgxCsvExporterOptions } from "./csv-exporter-options";

export interface ICsvExportEndedEventArgs {
    csvData: string;
}

@Injectable()
export class IgxCsvExporterService extends IgxBaseExporter {
    private _stringData: string;

    @Output()
    public onExportEnded = new EventEmitter<ICsvExportEndedEventArgs>();

    protected exportDataImplementation(data: any[], options: IgxCsvExporterOptions) {
        const csvData = new CharSeparatedValueData(data, options.valueDelimiter);
        this._stringData = csvData.prepareData();

        this.saveFile(options);
        this.onExportEnded.emit({ csvData: this._stringData });
    }

    private saveFile(options: IgxCsvExporterOptions) {
        switch (options.fileType) {
            case CsvFileTypes.CSV:
                this.exportFile(this._stringData, options.fileName, "text/csv;charset=utf-8;");
                break;
            case CsvFileTypes.TSV:
            case CsvFileTypes.TAB:
                this.exportFile(this._stringData, options.fileName, "text/tab-separated-values;charset=utf-8;");
                break;
        }
    }

    private exportFile(data: string, fileName: string, fileType: string): void {
        const blob = new Blob(["\ufeff", data], { type: fileType });
        ExportUtilities.saveBlobToFile(blob, fileName);
    }
}
