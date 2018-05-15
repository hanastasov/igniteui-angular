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

    buttonClicked() {
        
        //console.log("@@@ this.igxGrid1.toolbar : " + this.igxGrid1.toolbar);
        //console.log(this.igxGrid1.toolbar);

        //console.log("@@@ this.igxGrid1.toolbar.columnChooserButton : " + this.igxGrid1.toolbar.columnChooserButton);
        //console.log(this.igxGrid1.toolbar.columnChooserButton);
        
        //console.log("@@@ this.igxGrid1.toolbar.advFilteringButton : " + this.igxGrid1.toolbar.advFilteringButton);
        //console.log(this.igxGrid1.toolbar.advFilteringButton);
        
        //console.log("@@@ this.igxGrid1.toolbar.exportButton : " + this.igxGrid1.toolbar.exportButton);
        //console.log(this.igxGrid1.toolbar.exportButton);




        /*console.log("@@@ this.igxGrid1.toolbar.showColumnChooser : " + this.igxGrid1.toolbar.showColumnChooser);
        console.log("@@@ this.igxGrid1.toolbar.showPinningChooser : " + this.igxGrid1.toolbar.showPinningChooser);
        console.log("@@@ this.igxGrid1.toolbar.titleContent : " + this.igxGrid1.toolbar.titleContent);

        this.igxGrid1.toolbar.showColumnChooser = true;
        this.igxGrid1.toolbar.showPinningChooser = true;
        this.igxGrid1.toolbar.titleContent = "new title";
        */
    }

    toolbarExportClicked(obj) {
        console.log(obj);
        obj.cancel = false;
    }

}
