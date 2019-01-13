import {Component, Input, OnInit} from '@angular/core';
import {Bill} from "../../shared/models/bill.model";
import {BillService} from "../../shared/services/bill.service";

@Component({
    selector: 'app-bill-card',
    templateUrl: './bill-card.component.html',
    styleUrls: ['./bill-card.component.sass']
})
export class BillCardComponent implements OnInit {
    @Input() bill: Bill;
    @Input() currency: any;

    dollar: number;
    euro: number;

    constructor(private billService: BillService) {
    }

    ngOnInit() {
        const {Valute} = this.currency;
        this.dollar = this.bill.value / Valute['USD'].Value;
        this.euro = this.bill.value / Valute['EUR'].Value;
    }

}
