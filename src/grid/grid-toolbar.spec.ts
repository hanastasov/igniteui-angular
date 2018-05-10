
import { Component, DebugElement, ViewChild } from "@angular/core";
import { async, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { IgxGridToolbarComponent } from "./grid-toolbar.component";
import { IgxGridComponent } from "./grid.component";
import { IgxGridModule } from "./index";

fdescribe("IgxGrid - Grid Toolbar", () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GridToolbarTestPageComponent,
                //IgxGridCaptionComponent,
                //IgxGridComponent
            ],
            imports: [
                //IgxGridCaptionComponent,
                IgxGridModule.forRoot()
            ]
        })
        .compileComponents();
    }));

    it(" testing title ", () => {
        const fixture = TestBed.createComponent(GridToolbarTestPageComponent);
        fixture.detectChanges();
        
        const testPage = fixture.componentInstance;
        
        expect(testPage.gridToolbar1.hasTitle).toBe(false);
        //expect(testPage.gridToolbar1.hasTitle).toBeTruthy();
        testPage.gridToolbar1.titleContent = "Some title";
        expect(testPage.gridToolbar1.hasTitle).toBe(true);
        testPage.gridToolbar1.titleContent = null;
        expect(testPage.gridToolbar1.hasTitle).toBe(false);


        const grid = fixture.debugElement.query(By.css("igx-grid"));


        const gridToolbar = grid.query(By.css(".igx-grid__caption"));

        const gridToolbarTitle = grid.children[0].query(By.css(".igx-grid__caption-title"));



        

        // console.log("@@@ 1:" + grid);
        // console.log("@@@ 2:" + gridCaption);
        console.log(grid);
        console.log(gridToolbar);
        console.log(gridToolbarTitle);




    });




});



@Component({
    template: `
        <igx-grid #grid1 [data]="data" [autoGenerate]="true" width="400" height="200">
            <igx-grid-toolbar #gridToolbar1 titleContent="first title">
            </igx-grid-toolbar>
        </igx-grid>
    `
})
export class GridToolbarTestPageComponent {

    public data = [
        { ProductID: 1, ProductName: "Chai", InStock: true, UnitsInStock: 2760, OrderDate: new Date("2005-03-21") },
        { ProductID: 2, ProductName: "Aniseed Syrup", InStock: false, UnitsInStock: 198, OrderDate: new Date("2008-01-15") },
        { ProductID: 3, ProductName: "Chef Antons Cajun Seasoning", InStock: true, UnitsInStock: 52, OrderDate: new Date("2010-11-20") },
        { ProductID: 4, ProductName: "Grandmas Boysenberry Spread", InStock: false, UnitsInStock: 0, OrderDate: new Date("2007-10-11") },
        { ProductID: 5, ProductName: "Uncle Bobs Dried Pears", InStock: false, UnitsInStock: 0, OrderDate: new Date("2001-07-27") },
        { ProductID: 6, ProductName: "Northwoods Cranberry Sauce", InStock: true, UnitsInStock: 1098, OrderDate: new Date("1990-05-17") },
        { ProductID: 7, ProductName: "Queso Cabrales", InStock: false, UnitsInStock: 0, OrderDate: new Date("2005-03-03") },
        { ProductID: 8, ProductName: "Tofu", InStock: true, UnitsInStock: 7898, OrderDate: new Date("2017-09-09") },
        { ProductID: 9, ProductName: "Teatime Chocolate Biscuits", InStock: true, UnitsInStock: 6998, OrderDate: new Date("2025-12-25") },
        { ProductID: 10, ProductName: "Chocolate", InStock: true, UnitsInStock: 20000, OrderDate: new Date("2018-03-01") }
    ];

    @ViewChild("grid1", { read: IgxGridComponent })
    public grid1: IgxGridComponent;

    @ViewChild("gridToolbar1", { read: IgxGridToolbarComponent })
    public gridToolbar1: IgxGridToolbarComponent;

}



