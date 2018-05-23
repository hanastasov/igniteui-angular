import { Component, OnInit, ViewChild } from "@angular/core";
import { IgxGridComponent } from "../../lib/grid/grid.component";

@Component({
    selector: "igx-grid-toolbar-sample",
    styleUrls: ["../app.samples.css", "sample.component.css"],
    templateUrl: "./sample.component.html"
})
export class GridToolbarSampleComponent implements OnInit {
  
    @ViewChild("grid1", { read: IgxGridComponent })
    public igxGrid1: IgxGridComponent;
  
    data = [
        {
            Name: "Alice",
            Age: 25
        },
        {
            Name: "Bob",
            Age: 23
        }
    ];

    constructor() {
    }
    
    ngOnInit() {
    }

    toolbarExportClicked(obj) {
        console.log(obj);
        obj.cancel = false;
    }

}
