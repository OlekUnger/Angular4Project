import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Category} from "../../shared/models/category.model";
import {NgForm} from "@angular/forms";
import {Eevent} from "../../shared/models/event.model";
import * as moment from 'moment'
import {EventService} from "../../shared/services/event.srvice";
import {BillService} from "../../shared/services/bill.service";
import {Bill} from "../../shared/models/bill.model";
import {Message} from "../../../shared/models/message.model";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'app-add-event',
    templateUrl: './add-event.component.html',
    styleUrls: ['./add-event.component.sass']
})
export class AddEventComponent implements OnInit, OnDestroy {
    @Input() categories: Category[] = [];
    types = [
        {type: 'income', label: 'Доход'},
        {type: 'outcome', label: 'Расход'}
    ];
    message: Message;
    sub1: Subscription;
    sub2: Subscription;

    constructor(private eventService: EventService, private billService: BillService) {
    }

    ngOnInit() {
        this.message = new Message('danger', '')
    }

    ngOnDestroy() {
        if(this.sub1) this.sub1.unsubscribe();
        if(this.sub2) this.sub2.unsubscribe();
    }

    private showMessage(text: string) {
        this.message.text = text;
        window.setTimeout(()=>this.message.text='', 2000)
    }

    onSubmit(form: NgForm) {
        let {amount, description, category, type} = form.value;
        if (amount < 0) amount = Math.abs(amount);

        const event = new Eevent(type, amount, +category, moment().format('DD.MM.YYYY HH:mm:ss'), description)

        // получим счет
        this.sub1 = this.billService.getBill().subscribe(
            (bill: Bill)=>{
                let value = 0;
                if(type === 'outcome')  {
                    if(amount > bill.value) {
                        this.showMessage(`На счету недостаточно средств. Не хватает ${amount - bill.value}`);
                        return;
                    } else {
                        value = bill.value - amount
                    }
                } else {
                    value = bill.value + amount;
                }
                this.sub2 = this.billService.updateBill({value, currency: bill.currency})
                    .mergeMap(()=> this.eventService.addEvent(event))
                    .subscribe(()=>{
                        form.setValue({
                            amount: 1,
                            description: ' ',
                            category: 1,
                            type: 'outcome'
                        })
                    })

            }
        )
    }

}
