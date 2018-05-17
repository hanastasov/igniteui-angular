import { Component, DebugElement, ViewChild } from "@angular/core";
import { async, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BOOLEAN_FILTERS, DATE_FILTERS, FilteringCondition,
    NUMBER_FILTERS, STRING_FILTERS } from "../../src/data-operations/filtering-condition";
import { Calendar, ICalendarDate } from "../calendar/calendar";
import { FilteringLogic, IFilteringExpression } from "../data-operations/filtering-expression.interface";
import { IgxInputDirective } from "../directives/input/input.directive";
import { IgxGridComponent } from "./grid.component";
import { IgxGridModule } from "./index";

describe("IgxGrid - Filtering actions", () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                IgxGridFilteringComponent
            ],
            imports: [
                BrowserAnimationsModule,
                IgxGridModule.forRoot()]
        })
        .compileComponents();
    }));

    // UI tests string column, empty input
    it("UI tests on string column", async(() => {
        const fix = TestBed.createComponent(IgxGridFilteringComponent);
        fix.detectChanges();

        const grid = fix.componentInstance.grid;
        const filterUIContainer = fix.debugElement.query(By.css("igx-grid-filter"));
        const filterIcon = filterUIContainer.query(By.css("igx-icon"));
        let input = filterUIContainer.query(By.directive(IgxInputDirective));
        const select = filterUIContainer.query(By.css("div > select"));
        const options = select.nativeElement.options;
        const reset = filterUIContainer.queryAll(By.css("button"))[0];
        const close = filterUIContainer.queryAll(By.css("button"))[1];

        expect(grid.rowList.length).toEqual(8);

        filterIcon.nativeElement.click();
        fix.detectChanges();

        fix.whenStable().then(() => {
            // iterate over not unary conditions when input is empty
            // starts with
            verifyFilterUIPosition(filterUIContainer, grid);

            options[1].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(8);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeTruthy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);

            // ends with
            options[2].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(8);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeTruthy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);

            // does not contain
            options[3].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(8);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeTruthy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);

            // equals
            options[4].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(8);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeTruthy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);

            // does not equal
            options[5].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(8);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeTruthy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);

            // iterate over unary conditions
            // null
            options[6].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(3);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(input.nativeElement.offsetHeight).toEqual(0);

            // not null
            options[7].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(5);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(input.nativeElement.offsetHeight).toEqual(0);

            // empty
            options[8].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(4);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(input.nativeElement.offsetHeight).toEqual(0);

            // not empty
            options[9].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(4);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(input.nativeElement.offsetHeight).toEqual(0);

            // changing from unary to not unary condition when input is empty - filtering should keep its state
            // contains
            options[0].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            input = filterUIContainer.query(By.directive(IgxInputDirective));
            expect(grid.rowList.length).toEqual(4);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            // input is empty but there is filtering applied, so reset button should be active !
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);
        });
    }));

    // UI tests string column with value in input
    it("UI tests on string column", async(() => {
        const fix = TestBed.createComponent(IgxGridFilteringComponent);
        fix.detectChanges();

        const grid = fix.componentInstance.grid;
        const filterUIContainer = fix.debugElement.query(By.css("igx-grid-filter"));
        const filterIcon = filterUIContainer.query(By.css("igx-icon"));
        const input = filterUIContainer.query(By.directive(IgxInputDirective));
        const select = filterUIContainer.query(By.css("div > select"));
        const options = select.nativeElement.options;
        const reset = filterUIContainer.queryAll(By.css("button"))[0];
        const close = filterUIContainer.queryAll(By.css("button"))[1];

        expect(grid.rowList.length).toEqual(8);

        filterIcon.nativeElement.click();
        fix.detectChanges();

        fix.whenStable().then(() => {
            // iterate over not unary conditions and fill the input
            // contains
            sendInput(input, "Ignite", fix);
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(2);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);

            // starts with
            options[1].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            sendInput(input, "Net", fix);
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            verifyFilterUIPosition(filterUIContainer, grid);
            expect(grid.rowList.length).toEqual(1);
            expect(grid.getCellByColumn(0, "ID").value).toEqual(2);
            expect(grid.getCellByColumn(0, "ProductName").value).toMatch("NetAdvantage");
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);

            // ends with
            options[2].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            sendInput(input, "script", fix);
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(2);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);

            // does not contain
            options[3].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(6);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);

            // use reset button
            reset.nativeElement.click();
            fix.detectChanges();
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(8);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeTruthy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);

            // equals
            options[4].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            sendInput(input, "NetAdvantage", fix);
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(1);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);

            // equals
            options[4].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            sendInput(input, " ", fix);
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(0);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);
            const emptyTemplate = fix.debugElement.query(By.css("span.igx-grid__tbody-message"));
            expect(emptyTemplate.nativeElement.offsetHeight).toBeGreaterThan(0);

            // does not equal
            options[5].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            sendInput(input, "NetAdvantage", fix);
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(7);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);
        });
    }));

    // UI tests number column
    it("UI tests on number column", async(() => {
        const fix = TestBed.createComponent(IgxGridFilteringComponent);
        fix.detectChanges();

        const grid = fix.componentInstance.grid;
        const filterUIContainer = fix.debugElement.queryAll(By.css("igx-grid-filter"))[1];
        const filterIcon = filterUIContainer.query(By.css("igx-icon"));
        let input = filterUIContainer.query(By.directive(IgxInputDirective));
        const select = filterUIContainer.query(By.css("div > select"));
        const options = select.nativeElement.options;
        const reset = filterUIContainer.queryAll(By.css("button"))[0];
        const close = filterUIContainer.queryAll(By.css("button"))[1];

        expect(grid.rowList.length).toEqual(8);
        expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
        expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeTruthy();

        filterIcon.nativeElement.click();
        fix.detectChanges();

        fix.whenStable().then(() => {

            verifyFilterUIPosition(filterUIContainer, grid);

            // iterate over not unary conditions and fill the input
            // equals
            sendInput(input, 0, fix);
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(1);
            expect(grid.getCellByColumn(0, "Downloads").value).toEqual(0);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            const clear = filterUIContainer.query(By.css("igx-suffix"));
            expect(clear.nativeElement.offsetHeight).toBeGreaterThan(0);

            // clear input value
            input.nativeElement.value = "";
            input.nativeElement.dispatchEvent(new Event("input"));
            fix.detectChanges();
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();

            // iterate over not unary conditions when input is empty
            // does not equal
            options[1].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(8);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeTruthy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);

            // greater than
            options[2].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(8);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeTruthy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);

            // iterate over unary conditions
            // null
            options[6].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(1);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(input.nativeElement.offsetHeight).toEqual(0);

            // not null
            options[7].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(7);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(input.nativeElement.offsetHeight).toEqual(0);

            // empty
            options[8].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(1);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(input.nativeElement.offsetHeight).toEqual(0);

            // not empty
            options[9].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(7);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(input.nativeElement.offsetHeight).toEqual(0);

            // changing from unary to not unary condition when input is empty - filtering should keep its state
            // equals - filter should keep its state and not be reset
            options[0].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            input = filterUIContainer.query(By.directive(IgxInputDirective));
            expect(grid.rowList.length).toEqual(7);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            // input is empty but there is filtering applied, so reset button should be active !
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);

            // iterate over not unary conditions and fill the input
            // equals
            sendInput(input, 100, fix);
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(1);
            expect(grid.getCellByColumn(0, "Downloads").value).toEqual(100);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            const clear = filterUIContainer.query(By.css("igx-suffix"));
            expect(clear.nativeElement.offsetHeight).toBeGreaterThan(0);
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);

            // does not equal
            options[1].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(7);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);

            // greater than
            options[2].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            sendInput(input, 300, fix);
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(2);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);

            // use reset button
            reset.nativeElement.click();
            fix.detectChanges();
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(8);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeTruthy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);
            expect(select.nativeElement.value).toMatch("equals");

            // less than
            options[3].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            sendInput(input, 100, fix);
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(3);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);

            // use clear button
            const clear = filterUIContainer.query(By.css("igx-suffix"));
            clear.nativeElement.click();
            fix.detectChanges();
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(8);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeTruthy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);
            expect(select.nativeElement.value).toMatch("lessThan");

            // greater than or equal to
            options[4].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            sendInput(input, 254, fix);
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(3);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);

            // less than or equal to
            options[5].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(6);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(input.nativeElement.offsetHeight).toBeGreaterThan(0);
        });
    }));

    // UI tests boolean column
    it("UI tests on boolean column", async(() => {
        const fix = TestBed.createComponent(IgxGridFilteringComponent);
        fix.detectChanges();

        const grid = fix.componentInstance.grid;
        const filterUIContainer = fix.debugElement.queryAll(By.css("igx-grid-filter"))[2];
        const filterIcon = filterUIContainer.query(By.css("igx-icon"));
        const select = filterUIContainer.query(By.css("div > select"));
        const options = select.nativeElement.options;
        const reset = filterUIContainer.queryAll(By.css("button"))[0];
        const close = filterUIContainer.queryAll(By.css("button"))[1];

        expect(grid.rowList.length).toEqual(8);

        filterIcon.nativeElement.click();
        fix.detectChanges();

        fix.whenStable().then(() => {
            verifyFilterUIPosition(filterUIContainer, grid);

            // false condition
            options[2].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(2);
            expect(grid.getCellByColumn(0, "Released").value).toBeFalsy();
            expect(grid.getCellByColumn(1, "Released").value).toBeFalsy();
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();

            // true condition
            options[1].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(3);
            expect(grid.getCellByColumn(0, "Released").value).toBe(true);
            expect(grid.getCellByColumn(1, "Released").value).toBe(true);
            expect(grid.getCellByColumn(2, "Released").value).toBe(true);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();

            // (all) condition
            options[0].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(8);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeTruthy();

            // null condition
            options[3].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(2);
            expect(grid.getCellByColumn(0, "Released").value).toEqual(null);
            expect(grid.getCellByColumn(1, "Released").value).toEqual(null);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();

            // not null condition
            options[4].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(6);
            expect(grid.getCellByColumn(0, "Released").value).toBe(false);
            expect(grid.getCellByColumn(1, "Released").value).toBe(true);
            expect(grid.getCellByColumn(2, "Released").value).toBe(true);
            expect(grid.getCellByColumn(3, "Released").value).toMatch("");
            expect(grid.getCellByColumn(4, "Released").value).toBe(true);
            expect(grid.getCellByColumn(5, "Released").value).toBe(undefined);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();

            // empty condition
            options[5].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(3);
            expect(grid.getCellByColumn(0, "Released").value).toEqual(null);
            expect(grid.getCellByColumn(1, "Released").value).toEqual(null);
            expect(grid.getCellByColumn(2, "Released").value).toEqual(undefined);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();

            // not empty condition
            options[6].selected = true;
            select.nativeElement.dispatchEvent(new Event("change"));
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(5);
            expect(grid.getCellByColumn(0, "Released").value).toBe(false);
            expect(grid.getCellByColumn(1, "Released").value).toBe(true);
            expect(grid.getCellByColumn(2, "Released").value).toBe(true);
            expect(grid.getCellByColumn(3, "Released").value).toMatch("");
            expect(grid.getCellByColumn(4, "Released").value).toBe(true);
            expect(close.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
            expect(reset.nativeElement.classList.contains("igx-button--disabled")).toBeFalsy();
        });
    }));

    // UI tests date column
    it("UI - should correctly filter date column by 'today' filtering conditions", () => {
        const fix = TestBed.createComponent(IgxGridFilteringComponent);
        fix.detectChanges();

        const grid = fix.componentInstance.grid;
        const filterUIContainer = fix.debugElement.queryAll(By.css("igx-grid-filter"))[3];
        const filterIcon = filterUIContainer.query(By.css("igx-icon"));
        const select = filterUIContainer.query(By.css("div > select"));

        filterUIContainer.triggerEventHandler("mousedown", null);
        fix.detectChanges();
        filterIcon.nativeElement.click();
        fix.detectChanges();
        verifyFilterUIPosition(filterUIContainer, grid);
        select.nativeElement.value = "today";
        select.nativeElement.dispatchEvent(new Event("change"));
        fix.detectChanges();

        // only one record is populated with "today" date, this is why rows must be 1
        expect(grid.rowList.length).toEqual(1);
    });

    it("UI - should correctly filter date column by 'yesterday' filtering conditions", () => {
        const fix = TestBed.createComponent(IgxGridFilteringComponent);
        fix.detectChanges();

        const grid = fix.componentInstance.grid;
        const filterUIContainer = fix.debugElement.queryAll(By.css("igx-grid-filter"))[3];
        const filterIcon = filterUIContainer.query(By.css("igx-icon"));
        const select = filterUIContainer.query(By.css("div > select"));

        filterUIContainer.triggerEventHandler("mousedown", null);
        fix.detectChanges();
        filterIcon.nativeElement.click();
        fix.detectChanges();
        verifyFilterUIPosition(filterUIContainer, grid);

        select.nativeElement.value = "yesterday";
        select.nativeElement.dispatchEvent(new Event("change"));
        fix.detectChanges();

        // only one record is populated with (today - 1 day)  date, this is why rows must be 1
        expect(grid.rowList.length).toEqual(1);
    });

    it("UI - should correctly filter date column by 'this month' filtering conditions", () => {
        const fix = TestBed.createComponent(IgxGridFilteringComponent);
        fix.detectChanges();

        const grid = fix.componentInstance.grid;
        const filterIcon = fix.debugElement.queryAll(By.css("igx-grid-filter"))[3];
        const select = filterIcon.query(By.css("div > select"));
        const cal = fix.componentInstance.timeGenerator;
        const today = fix.componentInstance.today;

        // Fill expected results based on the current date
        fillExpectedResults(grid, cal, today);

        filterIcon.triggerEventHandler("mousedown", null);
        fix.detectChanges();
        filterIcon.nativeElement.click();
        fix.detectChanges();
        verifyFilterUIPosition(filterIcon, grid);
        select.nativeElement.value = "thisMonth";
        select.nativeElement.dispatchEvent(new Event("change"));
        fix.detectChanges();

        expect(grid.rowList.length).toEqual(expectedResults[5]);
    });

    it("UI - should correctly filter date column by 'next month' filtering conditions", () => {
        const fix = TestBed.createComponent(IgxGridFilteringComponent);
        fix.detectChanges();

        const grid = fix.componentInstance.grid;
        const filterIcon = fix.debugElement.queryAll(By.css("igx-grid-filter"))[3];

        const select = filterIcon.query(By.css("div > select"));
        const cal = fix.componentInstance.timeGenerator;
        const today = fix.componentInstance.today;

        // Fill expected results based on the current date
        fillExpectedResults(grid, cal, today);

        filterIcon.triggerEventHandler("mousedown", null);
        fix.detectChanges();
        filterIcon.nativeElement.click();
        fix.detectChanges();
        verifyFilterUIPosition(filterIcon, grid);
        select.nativeElement.value = "nextMonth";
        select.nativeElement.dispatchEvent(new Event("change"));
        fix.detectChanges();

        expect(grid.rowList.length).toEqual(expectedResults[1]);
    });

    it("UI - should correctly filter date column by 'last month' filtering conditions", () => {
        const fix = TestBed.createComponent(IgxGridFilteringComponent);
        fix.detectChanges();

        const grid = fix.componentInstance.grid;
        const filterIcon = fix.debugElement.queryAll(By.css("igx-grid-filter"))[3];
        const select = filterIcon.query(By.css("div > select"));
        const cal = fix.componentInstance.timeGenerator;
        const today = fix.componentInstance.today;

        // Fill expected results based on the current date
        fillExpectedResults(grid, cal, today);

        filterIcon.triggerEventHandler("mousedown", null);
        fix.detectChanges();
        filterIcon.nativeElement.click();
        fix.detectChanges();
        verifyFilterUIPosition(filterIcon, grid);
        select.nativeElement.value = "lastMonth";
        select.nativeElement.dispatchEvent(new Event("change"));
        fix.detectChanges();

        expect(grid.rowList.length).toEqual(expectedResults[0]);
    });

    it("UI - should correctly filter date column by 'empty' filtering conditions", () => {
        const fix = TestBed.createComponent(IgxGridFilteringComponent);
        fix.detectChanges();

        const grid = fix.componentInstance.grid;
        const filterIcon = fix.debugElement.queryAll(By.css("igx-grid-filter"))[3];
        const select = filterIcon.query(By.css("div > select"));

        filterIcon.triggerEventHandler("mousedown", null);
        fix.detectChanges();
        filterIcon.nativeElement.click();
        fix.detectChanges();
        verifyFilterUIPosition(filterIcon, grid);
        select.nativeElement.value = "empty";
        select.nativeElement.dispatchEvent(new Event("change"));
        fix.detectChanges();

        expect(grid.rowList.length).toEqual(2);
    });

    it("UI - should correctly filter date column by 'notEmpty' filtering conditions", () => {
        const fix = TestBed.createComponent(IgxGridFilteringComponent);
        fix.detectChanges();

        const grid = fix.componentInstance.grid;
        const filterIcon = fix.debugElement.queryAll(By.css("igx-grid-filter"))[3];
        const select = filterIcon.query(By.css("div > select"));

        filterIcon.triggerEventHandler("mousedown", null);
        fix.detectChanges();
        filterIcon.nativeElement.click();
        fix.detectChanges();
        verifyFilterUIPosition(filterIcon, grid);
        select.nativeElement.value = "notEmpty";
        select.nativeElement.dispatchEvent(new Event("change"));
        fix.detectChanges();

        expect(grid.rowList.length).toEqual(6);
    });

    it("UI - should correctly filter date column by 'null' filtering conditions", () => {
        const fix = TestBed.createComponent(IgxGridFilteringComponent);
        fix.detectChanges();

        const grid = fix.componentInstance.grid;
        const filterIcon = fix.debugElement.queryAll(By.css("igx-grid-filter"))[3];
        const select = filterIcon.query(By.css("div > select"));

        filterIcon.triggerEventHandler("mousedown", null);
        fix.detectChanges();
        filterIcon.nativeElement.click();
        fix.detectChanges();
        verifyFilterUIPosition(filterIcon, grid);
        select.nativeElement.value = "null";
        select.nativeElement.dispatchEvent(new Event("change"));
        fix.detectChanges();

        expect(grid.rowList.length).toEqual(1);
    });

    it("UI - should correctly filter date column by 'notNull' filtering conditions", () => {
        const fix = TestBed.createComponent(IgxGridFilteringComponent);
        fix.detectChanges();

        const grid = fix.componentInstance.grid;
        const filterIcon = fix.debugElement.queryAll(By.css("igx-grid-filter"))[3];
        const select = filterIcon.query(By.css("div > select"));

        filterIcon.triggerEventHandler("mousedown", null);
        fix.detectChanges();
        filterIcon.nativeElement.click();
        fix.detectChanges();
        verifyFilterUIPosition(filterIcon, grid);
        select.nativeElement.value = "notNull";
        select.nativeElement.dispatchEvent(new Event("change"));
        fix.detectChanges();

        expect(grid.rowList.length).toEqual(7);
    });

    it("UI - should correctly filter date column by 'thisYear' filtering conditions", () => {
        const fix = TestBed.createComponent(IgxGridFilteringComponent);
        fix.detectChanges();

        const grid = fix.componentInstance.grid;
        const filterIcon = fix.debugElement.queryAll(By.css("igx-grid-filter"))[3];
        const select = filterIcon.query(By.css("div > select"));
        const cal = fix.componentInstance.timeGenerator;
        const today = fix.componentInstance.today;

        // Fill expected results based on the current date
        fillExpectedResults(grid, cal, today);

        filterIcon.triggerEventHandler("mousedown", null);
        fix.detectChanges();
        filterIcon.nativeElement.click();
        fix.detectChanges();
        verifyFilterUIPosition(filterIcon, grid);
        select.nativeElement.value = "thisYear";
        select.nativeElement.dispatchEvent(new Event("change"));
        fix.detectChanges();

        expect(grid.rowList.length).toEqual(expectedResults[2]);
    });

    it("UI - should correctly filter date column by 'lastYear' filtering conditions", () => {
        const fix = TestBed.createComponent(IgxGridFilteringComponent);
        fix.detectChanges();

        const grid = fix.componentInstance.grid;
        const filterIcon = fix.debugElement.queryAll(By.css("igx-grid-filter"))[3];
        const select = filterIcon.query(By.css("div > select"));
        const cal = fix.componentInstance.timeGenerator;
        const today = fix.componentInstance.today;

        // Fill expected results based on the current date
        fillExpectedResults(grid, cal, today);

        filterIcon.triggerEventHandler("mousedown", null);
        fix.detectChanges();
        filterIcon.nativeElement.click();
        fix.detectChanges();
        verifyFilterUIPosition(filterIcon, grid);
        select.nativeElement.value = "lastYear";
        select.nativeElement.dispatchEvent(new Event("change"));
        fix.detectChanges();

        expect(grid.rowList.length).toEqual(expectedResults[4]);
    });

    it("UI - should correctly filter date column by 'nextYear' filtering conditions", () => {
        const fix = TestBed.createComponent(IgxGridFilteringComponent);
        fix.detectChanges();

        const grid = fix.componentInstance.grid;
        const filterIcon = fix.debugElement.queryAll(By.css("igx-grid-filter"))[3];
        const select = filterIcon.query(By.css("div > select"));
        const cal = fix.componentInstance.timeGenerator;
        const today = fix.componentInstance.today;

        // Fill expected results based on the current date
        fillExpectedResults(grid, cal, today);

        filterIcon.triggerEventHandler("mousedown", null);
        fix.detectChanges();
        filterIcon.nativeElement.click();
        fix.detectChanges();
        verifyFilterUIPosition(filterIcon, grid);
        select.nativeElement.value = "nextYear";
        select.nativeElement.dispatchEvent(new Event("change"));
        fix.detectChanges();

        expect(grid.rowList.length).toEqual(expectedResults[3]);
    });

    it("UI - should correctly filter date column by 'equals' filtering conditions", async(() => {
        const fix = TestBed.createComponent(IgxGridFilteringComponent);
        fix.detectChanges();

        const grid = fix.componentInstance.grid;
        const filterIcon = fix.debugElement.queryAll(By.css("igx-grid-filter"))[3];
        const select = filterIcon.query(By.css("div > select"));
        const input = filterIcon.query(By.directive(IgxInputDirective));

        fix.whenStable().then(() => {
            filterIcon.triggerEventHandler("mousedown", null);
            fix.detectChanges();
            filterIcon.nativeElement.click();
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            verifyFilterUIPosition(filterIcon, grid);
            select.nativeElement.value = "equals";
            select.nativeElement.dispatchEvent(new Event("change"));
            input.nativeElement.click();
            return fix.whenRenderingDone();
        }).then(() => {
            fix.detectChanges();
             // pick a date from the date picker
            const calendar = fix.debugElement.query(By.css("igx-calendar"));
            const currentDay = calendar.query(By.css("span.igx-calendar__date--current"));
            currentDay.nativeElement.click();
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            input.nativeElement.dispatchEvent(new Event("change"));
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(1);
        });

    }));

    it("UI - should correctly filter date column by 'doesNotEqual' filtering conditions", async(() => {
        const fix = TestBed.createComponent(IgxGridFilteringComponent);
        fix.detectChanges();

        const grid = fix.componentInstance.grid;
        const filterIcon = fix.debugElement.queryAll(By.css("igx-grid-filter"))[3];
        const select = filterIcon.query(By.css("div > select"));
        const input = filterIcon.query(By.directive(IgxInputDirective));

        fix.whenStable().then(() => {
            filterIcon.triggerEventHandler("mousedown", null);
            fix.detectChanges();
            filterIcon.nativeElement.click();
            verifyFilterUIPosition(filterIcon, grid);
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            select.nativeElement.value = "doesNotEqual";
            select.nativeElement.dispatchEvent(new Event("change"));
            input.nativeElement.click();
            return fix.whenRenderingDone();
        }).then(() => {
            fix.detectChanges();
             // pick a date from the date picker
            const calendar = fix.debugElement.query(By.css("igx-calendar"));
            const currentDay = calendar.query(By.css("span.igx-calendar__date--current"));
            currentDay.nativeElement.click();
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            input.nativeElement.dispatchEvent(new Event("change"));
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(7);
        });
    }));

    it("UI - should correctly filter date column by 'after' filtering conditions", async(() => {
        const fix = TestBed.createComponent(IgxGridFilteringComponent);
        fix.detectChanges();

        const grid = fix.componentInstance.grid;
        const filterIcon = fix.debugElement.queryAll(By.css("igx-grid-filter"))[3];
        const select = filterIcon.query(By.css("div > select"));
        const input = filterIcon.query(By.directive(IgxInputDirective));

        fix.whenStable().then(() => {
            filterIcon.triggerEventHandler("mousedown", null);
            fix.detectChanges();
            filterIcon.nativeElement.click();
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            verifyFilterUIPosition(filterIcon, grid);
            select.nativeElement.value = "after";
            select.nativeElement.dispatchEvent(new Event("change"));
            input.nativeElement.click();
            return fix.whenRenderingDone();
        }).then(() => {
            fix.detectChanges();
             // pick a date from the date picker
            const calendar = fix.debugElement.query(By.css("igx-calendar"));
            const currentDay = calendar.query(By.css("span.igx-calendar__date--current"));
            currentDay.nativeElement.click();
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            input.nativeElement.dispatchEvent(new Event("change"));
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(3);
        });
    }));

    it("UI - should correctly filter date column by 'before' filtering conditions", async(() => {
        const fix = TestBed.createComponent(IgxGridFilteringComponent);
        fix.detectChanges();

        const grid = fix.componentInstance.grid;
        const filterIcon = fix.debugElement.queryAll(By.css("igx-grid-filter"))[3];
        const select = filterIcon.query(By.css("div > select"));
        const input = filterIcon.query(By.directive(IgxInputDirective));

        fix.whenStable().then(() => {
            filterIcon.triggerEventHandler("mousedown", null);
            fix.detectChanges();
            filterIcon.nativeElement.click();
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            verifyFilterUIPosition(filterIcon, grid);
            select.nativeElement.value = "before";
            select.nativeElement.dispatchEvent(new Event("change"));
            input.nativeElement.click();
            return fix.whenRenderingDone();
        }).then(() => {
            fix.detectChanges();
             // pick a date from the date picker
            const calendar = fix.debugElement.query(By.css("igx-calendar"));
            const currentDay = calendar.query(By.css("span.igx-calendar__date--current"));
            currentDay.nativeElement.click();
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            input.nativeElement.dispatchEvent(new Event("change"));
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();
            expect(grid.rowList.length).toEqual(4);
        });
    }));

    it("Should correctly select month from month view datepicker/calendar component", async(() => {
        const fix = TestBed.createComponent(IgxGridFilteringComponent);
        fix.detectChanges();
        const filterIcon = fix.debugElement.queryAll(By.css("igx-grid-filter"))[3];
        const input = filterIcon.query(By.directive(IgxInputDirective));

        fix.whenStable().then(() => {
            filterIcon.triggerEventHandler("mousedown", null);
            fix.detectChanges();
            filterIcon.nativeElement.click();
            fix.detectChanges();
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();

            input.nativeElement.click();
            fix.detectChanges();

            const calendar = fix.debugElement.query(By.css("igx-calendar"));
            const monthView = calendar.queryAll(By.css(".date__el"))[0];
            monthView.nativeElement.click();

            fix.detectChanges();

            const firstMonth = calendar.queryAll(By.css(".igx-calendar__month"))[0];
            firstMonth.nativeElement.click();

            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();

            const calendar = fix.debugElement.query(By.css("igx-calendar"));
            const month = calendar.queryAll(By.css(".date__el"))[0];

            expect(month.nativeElement.textContent.trim()).toEqual("Jan");
        });
    }));

    it("Should correctly select year from year view datepicker/calendar component", async(() => {
        const fix = TestBed.createComponent(IgxGridFilteringComponent);
        fix.detectChanges();
        const filterIcon = fix.debugElement.queryAll(By.css("igx-grid-filter"))[3];
        const input = filterIcon.query(By.directive(IgxInputDirective));

        fix.whenStable().then(() => {
            filterIcon.triggerEventHandler("mousedown", null);
            fix.detectChanges();
            filterIcon.nativeElement.click();
            fix.detectChanges();
            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();

            input.nativeElement.click();
            fix.detectChanges();

            const calendar = fix.debugElement.query(By.css("igx-calendar"));
            const monthView = calendar.queryAll(By.css(".date__el"))[1];
            monthView.nativeElement.click();

            fix.detectChanges();

            const firstMonth = calendar.queryAll(By.css(".igx-calendar__year"))[0];
            firstMonth.nativeElement.click();

            return fix.whenStable();
        }).then(() => {
            fix.detectChanges();

            const calendar = fix.debugElement.query(By.css("igx-calendar"));
            const month = calendar.queryAll(By.css(".date__el"))[1];

            const today = new Date(Date.now());

            const expectedResult = today.getFullYear() - 3;
            expect(month.nativeElement.textContent.trim()).toEqual(expectedResult.toString());
        });
    }));
});

@Component({
    template: `<igx-grid [data]="data" height="500px">
        <igx-column [field]="'ID'" [header]="'ID'"></igx-column>
        <igx-column [field]="'ProductName'" [filterable]="true" dataType="string"></igx-column>
        <igx-column [field]="'Downloads'" [filterable]="true" dataType="number"></igx-column>
        <igx-column [field]="'Released'" [filterable]="true" dataType="boolean"></igx-column>
        <igx-column [field]="'ReleaseDate'" [header]="'ReleaseDate'"
            [filterable]="true" dataType="date">
        </igx-column>
    </igx-grid>`
})
export class IgxGridFilteringComponent {

    public timeGenerator: Calendar = new Calendar();
    public today: Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0);

    public data = [
        {
            Downloads: 254,
            ID: 1,
            ProductName: "Ignite UI for JavaScript",
            ReleaseDate: this.timeGenerator.timedelta(this.today, "day", 15),
            Released: false
        },
        {
            Downloads: 127,
            ID: 2,
            ProductName: "NetAdvantage",
            ReleaseDate: this.timeGenerator.timedelta(this.today, "month", -1),
            Released: true
        },
        {
            Downloads: 20,
            ID: 3,
            ProductName: "Ignite UI for Angular",
            ReleaseDate: null,
            Released: null
        },
        {
            Downloads: null,
            ID: 4,
            ProductName: null,
            ReleaseDate: this.timeGenerator.timedelta(this.today, "day", -1),
            Released: true
        },
        {
            Downloads: 100,
            ID: 5,
            ProductName: "",
            ReleaseDate: undefined,
            Released: false
        },
        {
            Downloads: 702,
            ID: 6,
            ProductName: "Some other item with Script",
            ReleaseDate: this.timeGenerator.timedelta(this.today, "day", 1),
            Released: null
        },
        {
            Downloads: 0,
            ID: 7,
            ProductName: null,
            ReleaseDate: this.timeGenerator.timedelta(this.today, "month", 1),
            Released: true
        },
        {
            Downloads: 1000,
            ID: 8,
            ProductName: null,
            ReleaseDate: this.today,
            Released: undefined
        }
    ];

    @ViewChild(IgxGridComponent) public grid: IgxGridComponent;
}

const expectedResults = [];

function sendInput(element, text, fix) {
    element.nativeElement.value = text;
    element.nativeElement.dispatchEvent(new Event("input"));
    fix.detectChanges();
    return fix.whenStable();
}

function verifyFilterUIPosition(filterUIContainer, grid) {
    const filterUiRightBorder = filterUIContainer.nativeElement.offsetParent.offsetLeft +
    filterUIContainer.nativeElement.offsetLeft + filterUIContainer.nativeElement.offsetWidth;
    expect(filterUiRightBorder).toBeLessThanOrEqual(grid.nativeElement.offsetWidth);
}

// Fill expected results for 'date' filtering conditions based on the current date
function fillExpectedResults(grid: IgxGridComponent, calendar: Calendar, today) {
    // day + 15
    const dateItem0 = generateICalendarDate(grid.data[0].ReleaseDate,
        today.getFullYear(), today.getMonth());
    // month - 1
    const dateItem1 = generateICalendarDate(grid.data[1].ReleaseDate,
        today.getFullYear(), today.getMonth());
    // day - 1
    const dateItem3 = generateICalendarDate(grid.data[3].ReleaseDate,
        today.getFullYear(), today.getMonth());
    // day + 1
    const dateItem5 = generateICalendarDate(grid.data[5].ReleaseDate,
        today.getFullYear(), today.getMonth());
    // month + 1
    const dateItem6 = generateICalendarDate(grid.data[6].ReleaseDate,
        today.getFullYear(), today.getMonth());

    let thisMonthCountItems = 1;
    let nextMonthCountItems = 1;
    let lastMonthCountItems = 1;
    let thisYearCountItems = 6;
    let nextYearCountItems = 0;
    let lastYearCountItems = 0;

    // LastMonth filter
    if (dateItem3.isPrevMonth) {
        lastMonthCountItems++;
    }
    expectedResults[0] = lastMonthCountItems;

    // thisMonth filter
    if (dateItem0.isCurrentMonth) {
        thisMonthCountItems++;
    }

    if (dateItem3.isCurrentMonth) {
        thisMonthCountItems++;
    }

    if (dateItem5.isCurrentMonth) {
        thisMonthCountItems++;
    }

    // NextMonth filter
    if (dateItem0.isNextMonth) {
        nextMonthCountItems++;
    }

    if (dateItem5.isNextMonth) {
        nextMonthCountItems++;
    }
    expectedResults[1] = nextMonthCountItems;

    // ThisYear, NextYear, PreviousYear filter

    // day + 15
    if (!dateItem0.isThisYear) {
        thisYearCountItems--;
    } else if (dateItem0.isNextYear) {
        nextYearCountItems++;
    }

    // month - 1
    if (!dateItem1.isThisYear) {
        thisYearCountItems--;
    }

    if (dateItem1.isLastYear) {
        lastYearCountItems++;
    }

    // day - 1
    if (!dateItem3.isThisYear) {
        thisYearCountItems--;
    }

    if (dateItem3.isLastYear) {
        lastYearCountItems++;
    }

    // day + 1
    if (!dateItem5.isThisYear) {
        thisYearCountItems--;
    }

    if (dateItem5.isNextYear) {
        nextYearCountItems++;
    }

    // month + 1
    if (!dateItem6.isThisYear) {
        thisYearCountItems--;
    }

    if (dateItem6.isNextYear) {
        nextYearCountItems++;
    }

    // ThisYear filter result
    expectedResults[2] = thisYearCountItems;

    // NextYear filter result
    expectedResults[3] = nextYearCountItems;

    // PreviousYear filter result
    expectedResults[4] = lastYearCountItems;

    // ThisMonth filter result
    expectedResults[5] = thisMonthCountItems;
}

function generateICalendarDate(date: Date, year: number, month: number) {
    return {
        date,
        isCurrentMonth: date.getFullYear() === year && date.getMonth() === month,
        isLastYear: isLastYear(date, year),
        isNextMonth: isNextMonth(date, year, month),
        isNextYear: isNextYear(date, year),
        isPrevMonth: isPreviousMonth(date, year, month),
        isThisYear: isThisYear(date, year)
    };
}

function isPreviousMonth(date: Date, year: number, month: number): boolean {
    if (date.getFullYear() === year) {
        return date.getMonth() < month;
    }
    return date.getFullYear() < year;
}

function isNextMonth(date: Date, year: number, month: number): boolean {
    if (date.getFullYear() === year) {
        return date.getMonth() > month;
    }
    return date.getFullYear() > year;
}

function isThisYear(date: Date, year: number): boolean {
    return date.getFullYear() === year;
}

function isLastYear(date: Date, year: number): boolean {
    return date.getFullYear() < year;
}

function isNextYear(date: Date, year: number): boolean {
    return date.getFullYear() > year;
}
