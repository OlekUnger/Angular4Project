import {Component, OnDestroy, OnInit} from '@angular/core';
import {BillService} from "../shared/services/bill.service";
import {CategoriesService} from "../shared/services/categories.service";
import {EventService} from "../shared/services/event.srvice";
import {Observable} from "rxjs/Observable";
import {Bill} from "../shared/models/bill.model";
import {Eevent} from "../shared/models/event.model";
import {Category} from "../shared/models/category.model";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'app-planning-page',
    templateUrl: './planning-page.component.html',
    styleUrls: ['./planning-page.component.sass']
})
export class PlanningPageComponent implements OnInit, OnDestroy {
    isLoaded = false;
    bill: Bill;
    categories: Category[] = [];
    events: Eevent[] = [];
    sub: Subscription;

    constructor(private billService: BillService,
                private categoriesService: CategoriesService,
                private eventService: EventService) {
    }

    ngOnInit() {
        this.sub = Observable.combineLatest(
            this.billService.getBill(),
            this.categoriesService.getCategories(),
            this.eventService.getEvents()
        ).subscribe((data: [Bill, Category[], Eevent[]])=>{
            this.bill = data[0];
            this.categories = data[1];
            this.events = data[2];
            this.isLoaded = true;
        })
    }

    ngOnDestroy() {
        if(this.sub) this.sub.unsubscribe()
    }

    getCategoryCost(cat: Category): number {
        const catEvents = this.events.filter(item=>item.category === cat.id && item.type === 'outcome');
        return catEvents.reduce((total, event)=>total += event.amount,0)
    }

    private getPercent(cat: Category): number {
        const percent = (100 * this.getCategoryCost(cat)) / cat.capacity;
        return percent > 100 ? 100 : percent;
    }

    getCatPercent(cat: Category): string {
        return this.getPercent(cat) + '%';
    }

    getCatColorClass(cat: Category): string {
        const percent = this.getPercent(cat);
        return percent < 60 ? 'success' : percent >= 100 ? 'danger' : 'warning';

    }

}
