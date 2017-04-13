import {Component, OnInit, Inject} from '@angular/core';
import 'rxjs/add/operator/startWith';
import {FormControl, FormGroup, FormBuilder, Validators} from "@angular/forms";
import {DestinationItem} from './destination-item';
import {ListItem} from './list-item';
import {Http, Response, RequestOptions, Headers, Request, RequestMethod, Jsonp} from '@angular/http';
import {MdDialog} from "@angular/material";
import {CategoryFilterPipe} from "./category-filter.pipe";

const MIN_ITEMS = 3;
const INITIAL_ITEMS = 300;
const SERVER_ADDR = 'http://totake.website:3000/'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit {
  MIN_CATEGORY_SELECTION_ITEMS:number = 3;
  form: FormGroup;
  minItems: number = MIN_ITEMS;
  title = 'app works!';
  displayItems: ListItem[] = [];
  displayItemsCategorys : ListItem[][] = [];
  items: ListItem[] = [];
  selectionList: ListItem[] = [];
  destinationList: DestinationItem[] = [];
  currentPage: number = 1;
  sendComplete: boolean =false;
  catActive: number;
  currentDisplayCategory: number = 0;
  otherItemsInput: string = "";

  selectedValue: string;
  selectPeriod: string;
  selectAge: number;

  ages: Array<number> = [1];

  destination = [
    {value: 'europe-0', viewValue: 'Europe'},
    {value: 'asia-1', viewValue: 'Asia'},
    {value: 'us-2', viewValue: 'United State'}
  ];

  periodTime = [
    {value: '7', viewValue: 'שבוע'},
    {value: '14', viewValue: 'שבועיים'},
    {value: '30', viewValue: 'חודש'},
    {value: '60', viewValue: 'יותר מחודש'}
  ];

  categoryNames = [
    {cid: 0, name: 'פריטי לבוש', selection: 0, minSelection: 3},
    {cid: 1, name: 'מסמכים/פרטי עזר', selection: 0, minSelection: 1},
    {cid: 2, name: 'עזרה ראשונה', selection: 0, minSelection: 1},
    {cid: 3, name: 'היגיינה וטיפוח', selection: 0, minSelection: 3},
    {cid: 4, name: 'מוצרי חשמל', selection: 0, minSelection: 1},
    {cid: 5, name: 'מזון', selection: 0, minSelection: 1},
    {cid: 6, name: 'ציוד למטייל', selection: 0, minSelection: 1},
    {cid: 7, name: 'אחר', selection: 0, minSelection: 1}
  ]

  stateCtrl: FormControl;
  filteredStates: any;

  constructor(@Inject(FormBuilder) fb: FormBuilder, private http: Http, private jsonp: Jsonp, public dialog: MdDialog) {

    this.form = fb.group({
      destination: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      period: ['', Validators.required]
    });

    this.ages = AppComponent.xrange(10, 120);

    this.loadRemoteItemList();
    this.loadRemoteDestinationList();

  }

  loadRemoteDestinationList() {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let itemsUrl = SERVER_ADDR + 'getDestination?callback=JSONP_CALLBACK';  // URL to web API
    this.jsonp.request(itemsUrl, {method: 'Get', headers: headers})
    // .subscribe((res) => {
    //   // this.result = res.json()
    //   this.onResult(res.json());
    //   console.log(res);
    // });
      .subscribe(
        (data) => {
          console.log(data);
          let jdata = data.json();
          for (let i = 0; i < jdata.length; i++) {
            // console.log(data.json()[i].item_id);
            let newItem: DestinationItem = {id: jdata[i].destination_id, name: jdata[i].he_name};
            this.destinationList.push(newItem);
          }
        },
        (error) => {
          console.log(error);
        });
  }

  loadRemoteItemList() {
    let items: ListItem[] = [];
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    let itemsUrl = SERVER_ADDR + 'getlist?callback=JSONP_CALLBACK';  // URL to web API
    this.jsonp.request(itemsUrl, {method: 'Get', headers: headers})
    // .subscribe((res) => {
    //   // this.result = res.json()
    //   this.onResult(res.json());
    //   console.log(res);
    // });
      .subscribe(
        (data) => {
          console.log(data);
          let jdata = data.json();
          for (let i = 0; i < jdata.length; i++) {
            // console.log(data.json()[i].item_id);
            let newItem: ListItem = {ItemId: jdata[i].item_id, name: jdata[i].he_name, isSelected: false, categoryId: jdata[i].category};
            items.push(newItem);
          }


          this.setDisplayItems(items);
          // this.setRandomItems();
        },
        (error) => {
          console.log(error);
        });
  }

  ngOnInit() {
    // this.itemService.getItems().subscribe

  }

  setRandomItems(): void {
    this.displayItems = this.items;
    // // let randomArray: ListItem[] = this.randomArray(this.items, Math.min(INITIAL_ITEMS, this.items.length));
    // let randomArray: ListItem[] = this.items;
    // for (let item of randomArray) {
    //   this.displayItems.push(item);
    // }
  }

  swap(indexI: number, indexJ: number, A: ListItem[]) {
    let temp: ListItem = A[indexI];
    A[indexI] = A[indexJ];
    A[indexJ] = temp;
  }

  randomArray(A: ListItem[], length: number = -1): ListItem[] {
    if (length == -1) {
      length = A.length;
    }
    let ANS: ListItem[] = A;
    for (let _i = 0; _i < length; _i++) {
      let rand = Math.floor(Math.random() * ANS.length);
      this.swap(_i, rand, ANS);
    }
    return ANS.splice(0, length);
  }

  static xrange(start: number, end: number): Array<number> {
    let ans: Array<number> = [0];
    let pos: number = 0;
    for (var i = start; i <= end; i++) {
      ans[pos] = i;
      pos++;
    }
    return ans;
  }

  itemClick(item: ListItem): void {
    var index;
    index = this.selectionList.indexOf(item, 0);
    if (index > -1) {
      this.categoryNames[this.currentDisplayCategory].selection--;
      // this.selectionList[index].isSelected = false;
      item.isSelected = false;
      this.selectionList.splice(index);

      for (let item of this.selectionList) {
        console.log(item.name);
      }
    } else {
      this.selectionList.push(item);
      // index = this.displayItems.indexOf(item, 0);
      // if (index > -1) {
      //   this.displayItems[index].isSelected = true;
      // }
      item.isSelected = true;
      this.categoryNames[this.currentDisplayCategory].selection++;
    }
  }

  getDisplayList(): ListItem[] {
    return (this.displayItems);
  }

  getDisplayListWithCategory(categoryId: number) : ListItem[] {
    let ans : ListItem[] = [];
    for (let item of this.displayItems) {
      if (item.categoryId == categoryId) {
        ans.push(item);
      }
    }
    return ans;
  }

  getSelectionIdList(): number[] {
    let ANS: number[] = [];
    for (let item of this.selectionList) {
      ANS.push(item.ItemId);
    }

    return ANS;
  }

  sendJson(): void {
    this.moveNextPpage();
    var send_data = {details: this.form.value, list: this.getSelectionIdList(), otherItem: this.otherItemsInput};
    let body: string = JSON.stringify(send_data);
    console.log(body);
    // let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let headers = new Headers({'Content-Type': 'application/json; charset=utf-8'});
    let options = new RequestOptions({headers: headers, method: "post"});
    //
    this.http
      .post(SERVER_ADDR + 'send', body, options)
      // .map(response => response.json())
      .subscribe(
        // () => console.log('Authentication Complete')
        // () => this.formFill = true
        () => this.sendComplete = true
      );
  }

  private setDisplayItems(items: ListItem[]) {
    let randItems = this.randomArray(items);
    for (let item of randItems) {
      this.displayItems.push(item);
    }
  }

  getChipColor(item: ListItem): string {
    if (item.isSelected) {
      return "accent";
    }
    else {
      return "primary";
    }
  }

  moveNextPpage() {
    this.currentPage++;
  }


  selectedItemCounter(): number {
    return this.selectionList.length;
  }

  goToNextCategory(): void {
    if (this.currentDisplayCategory < this.categoryNames.length) {
      this.currentDisplayCategory++;
    }
  }

  goToPrevCategory(): void {
    if (this.currentDisplayCategory > 0) {
      this.currentDisplayCategory--;
    }
  }

  currentCategoryName(): string {
    return this.categoryNames[this.currentDisplayCategory].name;
  }

  getTotalCategorySelection(): number {
    return this.categoryNames[this.currentDisplayCategory].selection;
  }

  getMinItemsForCategory(): number {
    return this.categoryNames[this.currentDisplayCategory].minSelection;
  }

  onKey(event: any) {
    this.categoryNames[this.currentDisplayCategory].selection++;
  }
}


