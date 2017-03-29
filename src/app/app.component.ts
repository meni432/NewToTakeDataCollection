import {Component, OnInit, Inject} from '@angular/core';
import 'rxjs/add/operator/startWith';
import {FormControl, FormGroup, FormBuilder, Validators} from "@angular/forms";
import {DestinationItem} from './destination-item';
import {ListItem} from './list-item';
import {Http, Response, RequestOptions, Headers, Request, RequestMethod, Jsonp} from '@angular/http';
import {MdDialog} from "@angular/material";

const MIN_ITEMS = 3;
const INITIAL_ITEMS = 300;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

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
    {value: '7', viewValue: 'Week'},
    {value: '30', viewValue: 'Month'},
    {value: '60', viewValue: 'Month+'}
  ];

  categoryName = [
    {id: 0, name: 'cat 1'},
    {id: 1, name: 'cat 2'},
    {id: 2, name: 'cat 5'},
    {id: 3, name: 'cat 4'}
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
    let itemsUrl = 'http://totake.website:3000/getDestination?callback=JSONP_CALLBACK';  // URL to web API
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
    let itemsUrl = 'http://totake.website:3000/getlist?callback=JSONP_CALLBACK';  // URL to web API
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
            let newItem: ListItem = {id: jdata[i].item_id, name: jdata[i].he_name, isSelected: false};
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
    }
  }

  getDisplayList(): ListItem[] {
    return (this.displayItems);
  }

  getSelectionIdList(): number[] {
    let ANS: number[] = [];
    for (let item of this.selectionList) {
      ANS.push(item.id);
    }
    return ANS;
  }

  sendJson(): void {
    this.moveNextPpage();
    var form_details = {"des": this.form.value.destination, "age": this.form.value.age};
    // var body = JSON.stringify({trip: this.form.value, list: JSON.stringify(this.getSelectionIdList()));
    var send_data = {details: this.form.value, list: this.getSelectionIdList()};
    let body: string = JSON.stringify(send_data);
    console.log(body);
    // let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let headers = new Headers({'Content-Type': 'application/json; charset=utf-8'});
    let options = new RequestOptions({headers: headers, method: "post"});
    //
    this.http
      .post('http://totake.website:3000/send', body, options)
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

  insertItemToCategoryList(item : ListItem) :void {
    let list : ListItem[] = this.displayItemsCategorys[item.categoryId];
    list.push(item);
  }

  removeItemFromCategoryList(item: ListItem) : void {
    let list : ListItem[] = this.displayItemsCategorys[item.categoryId];
    let index = list.indexOf(item);
    list.splice(index);
  }

  getItemsFromCategory(categoryId: number) : ListItem[] {
    let list : ListItem[]  = this.displayItemsCategorys[categoryId];
    return list;
  }

  selectedItemCounter(): number {
    return this.selectionList.length;
  }
}


