"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
require('rxjs/add/operator/startWith');
var forms_1 = require("@angular/forms");
var http_1 = require('@angular/http');
var MIN_ITEMS = 3;
var INITIAL_ITEMS = 300;
var AppComponent = (function () {
    function AppComponent(fb, http, jsonp, dialog) {
        var _this = this;
        this.http = http;
        this.jsonp = jsonp;
        this.dialog = dialog;
        this.minItems = MIN_ITEMS;
        this.title = 'app works!';
        this.values = '';
        this.displayItems = [];
        this.items = [];
        this.selectionList = [];
        this.destinationList = [];
        this.formFill = false;
        this.ages = [1];
        this.destination = [
            { value: 'europe-0', viewValue: 'Europe' },
            { value: 'asia-1', viewValue: 'Asia' },
            { value: 'us-2', viewValue: 'United State' }
        ];
        this.periodTime = [
            { value: '7', viewValue: 'Week' },
            { value: '30', viewValue: 'Month' },
            { value: '60', viewValue: 'Month+' }
        ];
        this.states = [
            'Alabama',
            'Alaska',
            'Arizona',
            'Arkansas',
            'California',
            'Colorado',
            'Connecticut',
            'Delaware',
            'Florida',
            'Georgia',
            'Hawaii',
            'Idaho',
            'Illinois',
            'Indiana',
            'Iowa',
            'Kansas',
            'Kentucky',
            'Louisiana',
            'Maine',
            'Maryland',
            'Massachusetts',
            'Michigan',
            'Minnesota',
            'Mississippi',
            'Missouri',
            'Montana',
            'Nebraska',
            'Nevada',
            'New Hampshire',
            'New Jersey',
            'New Mexico',
            'New York',
            'North Carolina',
            'North Dakota',
            'Ohio',
            'Oklahoma',
            'Oregon',
            'Pennsylvania',
            'Rhode Island',
            'South Carolina',
            'South Dakota',
            'Tennessee',
            'Texas',
            'Utah',
            'Vermont',
            'Virginia',
            'Washington',
            'West Virginia',
            'Wisconsin',
            'Wyoming',
        ];
        this.form = fb.group({
            destination: ['', forms_1.Validators.required],
            age: ['', forms_1.Validators.required],
            gender: ['', forms_1.Validators.required],
            period: ['', forms_1.Validators.required]
        });
        this.stateCtrl = new forms_1.FormControl();
        this.filteredStates = this.stateCtrl.valueChanges
            .startWith(null)
            .map(function (name) { return _this.filterStates(name); });
        this.ages = AppComponent.xrange(10, 120);
        this.loadRemoteItemList();
        this.loadRemoteDestinationList();
    }
    AppComponent.prototype.loadRemoteDestinationList = function () {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        var itemsUrl = 'http://totake.website:3000/getDestination?callback=JSONP_CALLBACK'; // URL to web API
        this.jsonp.request(itemsUrl, { method: 'Get', headers: headers })
            .subscribe(function (data) {
            console.log(data);
            var jdata = data.json();
            for (var i = 0; i < jdata.length; i++) {
                // console.log(data.json()[i].item_id);
                var newItem = { id: jdata[i].destination_id, name: jdata[i].he_name };
                _this.destinationList.push(newItem);
            }
        }, function (error) {
            console.log(error);
        });
    };
    AppComponent.prototype.loadRemoteItemList = function () {
        var _this = this;
        var items = [];
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        var itemsUrl = 'http://totake.website:3000/getlist?callback=JSONP_CALLBACK'; // URL to web API
        this.jsonp.request(itemsUrl, { method: 'Get', headers: headers })
            .subscribe(function (data) {
            console.log(data);
            var jdata = data.json();
            for (var i = 0; i < jdata.length; i++) {
                // console.log(data.json()[i].item_id);
                var newItem = { id: jdata[i].item_id, name: jdata[i].he_name, isSelected: false };
                items.push(newItem);
            }
            _this.setDisplayItems(items);
            // this.setRandomItems();
        }, function (error) {
            console.log(error);
        });
    };
    AppComponent.prototype.ngOnInit = function () {
        // this.itemService.getItems().subscribe
    };
    AppComponent.prototype.setRandomItems = function () {
        this.displayItems = this.items;
        // // let randomArray: ListItem[] = this.randomArray(this.items, Math.min(INITIAL_ITEMS, this.items.length));
        // let randomArray: ListItem[] = this.items;
        // for (let item of randomArray) {
        //   this.displayItems.push(item);
        // }
    };
    AppComponent.prototype.swap = function (indexI, indexJ, A) {
        var temp = A[indexI];
        A[indexI] = A[indexJ];
        A[indexJ] = temp;
    };
    AppComponent.prototype.randomArray = function (A, length) {
        if (length === void 0) { length = -1; }
        if (length == -1) {
            length = A.length;
        }
        var ANS = A;
        for (var _i = 0; _i < length; _i++) {
            var rand = Math.floor(Math.random() * ANS.length);
            this.swap(_i, rand, ANS);
        }
        return ANS.splice(0, length);
    };
    AppComponent.prototype.filterStates = function (val) {
        return val ? this.states.filter(function (s) { return new RegExp(val, 'gi').test(s); }) : this.states;
    };
    AppComponent.xrange = function (start, end) {
        var ans = [0];
        var pos = 0;
        for (var i = start; i <= end; i++) {
            ans[pos] = i;
            pos++;
        }
        return ans;
    };
    AppComponent.prototype.itemClick = function (item) {
        this.selectionList.unshift(item);
        var index = this.displayItems.indexOf(item, 0);
        if (index > -1) {
            this.displayItems[index].isSelected = true;
        }
        if (this.selectionList.length == MIN_ITEMS) {
            this.dialog.
            ;
        }
    };
    AppComponent.prototype.getDisplayList = function () {
        return this.displayItems;
    };
    AppComponent.prototype.getSelectionIdList = function () {
        var ANS = [];
        for (var _a = 0, _b = this.selectionList; _a < _b.length; _a++) {
            var item = _b[_a];
            ANS.push(item.id);
        }
        return ANS;
    };
    AppComponent.prototype.sendJson = function () {
        var _this = this;
        var form_details = { "des": this.form.value.destination, "age": this.form.value.age };
        // var body = JSON.stringify({trip: this.form.value, list: JSON.stringify(this.getSelectionIdList()));
        var send_data = { details: this.form.value, list: this.getSelectionIdList() };
        var body = JSON.stringify(send_data);
        console.log(body);
        // let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json; charset=utf-8' });
        var options = new http_1.RequestOptions({ headers: headers, method: "post" });
        //
        this.http
            .post('http://totake.website:3000/send', body, options)
            .subscribe(
        // () => console.log('Authentication Complete')
        function () { return _this.formFill = true; });
    };
    AppComponent.prototype.setDisplayItems = function (items) {
        for (var _a = 0, items_1 = items; _a < items_1.length; _a++) {
            var item = items_1[_a];
            this.displayItems.push(item);
        }
    };
    AppComponent.prototype.getChipColor = function (item) {
        if (item.isSelected) {
            return "accent";
        }
        else {
            return "primary";
        }
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css']
        }),
        __param(0, core_1.Inject(forms_1.FormBuilder))
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
