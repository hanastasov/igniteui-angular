import { AnimationBuilder } from "@angular/animations";
import { Component, DebugElement, ViewChild } from "@angular/core";
import { async, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { IgxGridToolbarComponent } from "./grid-toolbar.component";
import { IgxGridComponent } from "./grid.component";
import { IgxGridModule } from "./index";

describe("IgxGrid - Grid Toolbar", () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GridToolbarTestPage1Component,
                GridToolbarTestPage2Component
            ],
            imports: [
                IgxGridModule.forRoot()
            ],
            providers: [
                AnimationBuilder
            ]
        })
        .compileComponents();
    }));

    it(" testing toolbar title ", () => {
        const fixture = TestBed.createComponent(GridToolbarTestPage1Component);
        fixture.detectChanges();
        const testPage = fixture.componentInstance;

        const initialTitleValue = "Grid Toobar Title";
        const newTitleValue = "Some other title";

        const grid = fixture.debugElement.query(By.css("igx-grid"));
        const gridToolbar = grid.query(By.css("igx-grid-toolbar"));
        const gridToolbarTitle = gridToolbar.query(By.css(".igx-grid-toolbar__title"));

        expect(testPage.grid1.toolbarTitle).toBe(initialTitleValue);
        expect(gridToolbarTitle.nativeElement.innerText).toBe(initialTitleValue);

        testPage.grid1.toolbarTitle = newTitleValue;
        testPage.grid1.cdr.detectChanges();
        fixture.detectChanges();

        expect(testPage.grid1.toolbarTitle).toBe(newTitleValue);
        expect(gridToolbarTitle.nativeElement.innerText).toBe(newTitleValue);
    });

    it(" testing export button visibility", () => {
        const fixture = TestBed.createComponent(GridToolbarTestPage2Component);
        fixture.detectChanges();

        const testPage = fixture.componentInstance;
        const grid = fixture.debugElement.query(By.css("igx-grid"));
        const gridToolbar = grid.query(By.css("igx-grid-toolbar"));

        let exportButton = gridToolbar.query(By.css(".igx-grid-toolbar__dropdown"));
        console.log(exportButton);

        expect(exportButton).not.toBe(null);

        testPage.grid1.toolbarExportExcel = false;
        testPage.grid1.cdr.detectChanges();
        fixture.detectChanges();

        exportButton = gridToolbar.query(By.css(".igx-grid-toolbar__dropdown"));
        console.log(exportButton);

        expect(exportButton).toBe(null);
    });

});

@Component({
    template: `
        <igx-grid #grid1 [data]="data" [autoGenerate]="true" width="400" height="200"
            [showToolbar]="true"
            toolbarTitle="Grid Toobar Title"
            >
        </igx-grid>
    `
})
export class GridToolbarTestPage1Component {

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

}

@Component({
    template: `
        <igx-grid #grid1 [data]="data" [autoGenerate]="true" width="400" height="200"
            [showToolbar]="true"
            toolbarTitle="Grid Toobar Title"
            [toolbarExportExcel]="true"
            >
        </igx-grid>
    `
})
export class GridToolbarTestPage2Component {

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

}
