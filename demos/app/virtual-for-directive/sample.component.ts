import { Component, ElementRef, ViewChild, Injectable  } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Http } from "@angular/http";
import {
    IgxDialogModule,
    IgxFilterModule,
    IgxFilterOptions,
    IgxListModule,
    IgxListPanState,
    IgxRippleModule,
    IgxForOfDirective,
    IForOfState
} from "../../lib/main";


@Injectable()
export class RemoteService {
    public remoteData: Observable<any[]>;
    private url: string = "http://services.odata.org/V4/Northwind/Northwind.svc/Products";
    private _remoteData: BehaviorSubject<any[]>;

    constructor(private http: Http) {
        this._remoteData = new BehaviorSubject([]);
        this.remoteData = this._remoteData.asObservable();
    }

    public getData(data?: IForOfState, cb?: (any) => void): any {
        var dataState = data;
        return this.http.get(this.buildUrl(dataState)).pipe(
            map((response) => response.json()),
            map((response) => {
                return response;
            }))
            .subscribe((d) => {
                this._remoteData.next(d.value);
                if (cb) {
                    cb(d);
                }
            });
    }

    private buildUrl(dataState: any): string {
        let qS: string = "?", requiredChunkSize: number;
        if (dataState) {
            const skip = dataState.startIndex;

                requiredChunkSize =  dataState.chunkSize === 0 ?
                    // Set initial chunk size, the best value is igxForContainerSize divided on igxForItemSize
                    10 : dataState.chunkSize;
            const top = requiredChunkSize;
            qS += `$skip=${skip}&$top=${top}&$count=true`;
        }
        return `${this.url}${qS}`;
    }
}

@Component({
    selector: "virt-for-sample",
    styleUrls: ["../app.samples.css", "./sample.component.css"],
    templateUrl: "./sample.component.html",
    providers: [RemoteService]
})
export class VirtualForSampleComponent {
    public search1: string;
    public data: any[] = [];
    public remoteData:any;
	public options: any = {};
    public prevRequest:any;

    @ViewChild("virtDirVertical", { read: IgxForOfDirective })
    public virtDirVertical: IgxForOfDirective<any>;

    @ViewChild("virtDirHorizontal", { read: IgxForOfDirective })
    public virtDirHorizontal: IgxForOfDirective<any>;

    @ViewChild("virtDirRemote", { read: IgxForOfDirective })
    public virtDirRemote: IgxForOfDirective<any>;

    constructor(private remoteService: RemoteService) { }

    public ngOnInit(): void {
        this.remoteData = this.remoteService.remoteData;
        let data = [{
            key: 1,
            avatar: "images/avatar/1.jpg",
            favorite: true,
            link: "#",
            phone: "770-504-2217",
            text: "Terrance Orta",
            width: 100
            }, {
            key: 2,
            avatar: "images/avatar/2.jpg",
            favorite: false,
            link: "#",
            phone: "423-676-2869",
            text: "Richard Mahoney",
            width: 200
        }, {
             key: 3,
            avatar: "images/avatar/3.jpg",
            favorite: false,
            link: "#",
            phone: "859-496-2817",
            text: "Donna Price",
             width: 300
        }, {
            key: 4,
            avatar: "images/avatar/4.jpg",
            favorite: false,
            link: "#",
            phone: "901-747-3428",
            text: "Lisa Landers",
            width: 200
        }, {
             key: 5,
            avatar: "images/avatar/12.jpg",
            favorite: true,
            link: "#",
            phone: "573-394-9254",
            text: "Dorothy H. Spencer",
            width: 200
        }, {
             key: 6,
            avatar: "images/avatar/13.jpg",
            favorite: false,
            link: "#",
            phone: "323-668-1482",
            text: "Stephanie May",
            width: 100
        }, {
            key: 7,
            avatar: "images/avatar/14.jpg",
            favorite: false,
            link: "#",
            phone: "401-661-3742",
            text: "Marianne Taylor",
            width: 100
        }, {
            key: 8,
            avatar: "images/avatar/15.jpg",
            favorite: true,
            link: "#",
            phone: "662-374-2920",
            text: "Tammie Alvarez",
            width: 300
        }, {
            key: 9,
            avatar: "images/avatar/16.jpg",
            favorite: true,
            link: "#",
            phone: "240-455-2267",
            text: "Charlotte Flores",
            width: 200
        }, {
            key: 10,
            avatar: "images/avatar/17.jpg",
            favorite: false,
            link: "#",
            phone: "724-742-0979",
            text: "Ward Riley",
            width: 100
        }];
	for(let i = 10; i < 100000; i++) {
        var obj = Object.assign({}, data[i % 10]);
        obj["key"] = i;
        data.push(obj);
	}
    this.data = data;
}

public ngAfterViewInit() {
    this.remoteService.getData(this.virtDirRemote.state, (data) => {
        this.virtDirRemote.totalItemCount = data["@odata.count"];
    });
}
chunkLoading(evt) {
    if(this.prevRequest){
        this.prevRequest.unsubscribe();
     }
     this.prevRequest = this.remoteService.getData(evt, ()=> {
        this.virtDirRemote.cdr.detectChanges();
    });
}
scrNextRow(){
    this.virtDirVertical.scrollNext();
}
scrPrevRow(){
    this.virtDirVertical.scrollPrev();
}
scrScrollTo(index){
    this.virtDirVertical.scrollTo(index);
}
scrNextCol(){
    this.virtDirHorizontal.scrollNext();
}
scrPrevCol(){
    this.virtDirHorizontal.scrollPrev();
}

scrHorizontalScrollTo(index){
    this.virtDirHorizontal.scrollTo(index);
}

}
