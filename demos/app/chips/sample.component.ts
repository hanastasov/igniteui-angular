import { Component, ViewChild } from "@angular/core";
import { IgxChipsAreaComponent } from "../../lib/main";

@Component({
    selector: "chips-sample",
    styleUrls: ["sample.component.css", "../app.samples.css"],
    templateUrl: "sample.component.html"
})
export class IgxChipsSampleComponent {
    public chipList = [
        { id: "Country", text: "Country" },
        { id: "City", text: "City" },
        { id: "Town", text: "Town" },
        { id: "FirstName", text: "First Name" },
    ];

    @ViewChild("chipsArea", { read: IgxChipsAreaComponent})
    public chipsArea: IgxChipsAreaComponent

    chipsOrderChanged(event) {
        const newChipList = [];
        for (let i = 0; i < event.chipsArray.length; i++) {
            const chipItem = this.chipList.filter((item) => {
                return item.id === event.chipsArray[i].id;
            })[0];
            newChipList.push(chipItem);
        }
        this.chipList = newChipList;
        event.isValid = true;
    }

    chipMovingEnded() {
    }

    chipRemoved(event) {
        this.chipList = this.chipList.filter((item) => {
            return item.id !== event.chip.id;
        });
        this.chipsArea.cdr.detectChanges();
    }
}
