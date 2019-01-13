import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-currency-card',
    templateUrl: './currency-card.component.html',
    styleUrls: ['./currency-card.component.sass']
})
export class CurrencyCardComponent implements OnInit {
    @Input() currency: any;
    currencies: string[] = ['USD', 'EUR'];

    constructor() {
    }

    ngOnInit() {
        // console.log(this.currency)
    }

}
