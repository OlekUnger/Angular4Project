import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Bill} from "../models/bill.model";
import {BaseApi} from "../../../shared/core/base-api";

@Injectable()
export class BillService extends BaseApi{

    constructor(public http: Http) {
        super(http)
    }

    getBill(): Observable<Bill> {
        return this.get('bill')
    }

    getCurrency(base: string='USD'): Observable<any> {

        return this.http.get(`https://www.cbr-xml-daily.ru/daily_json.js`)
            .map((response: Response)=>response.json())
    }


    updateBill(bill: Bill): Observable<Bill> {
        return this.put('bill', bill)
    }
}
