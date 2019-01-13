import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoriesService} from "../shared/services/categories.service";
import {EventService} from "../shared/services/event.srvice";
import {Observable} from "rxjs/Observable";
import {Category} from "../shared/models/category.model";
import {Eevent} from "../shared/models/event.model";
import {Subscription} from "rxjs/Subscription";
import * as moment from 'moment'

@Component({
    selector: 'app-history-page',
    templateUrl: './history-page.component.html',
    styleUrls: ['./history-page.component.sass']
})
export class HistoryPageComponent implements OnInit, OnDestroy {
    categories: Category[] = [];
    events: Eevent[] = [];
    isLoaded = false;
    chartData = [];
    sub: Subscription;
    isFilterVisible = false;
    filteredEvents: Eevent[] = [];

    constructor(private categoriesService: CategoriesService, private eventService: EventService) {
    }

    ngOnInit() {
        this.sub = Observable.combineLatest(
            this.categoriesService.getCategories(),
            this.eventService.getEvents()
        ).subscribe(
            (data: [Category[], Eevent[]]) => {
                this.categories = data[0];
                this.events = data[1];
                this.setOriginalEvents();
                this.calculateChartData();


                this.isLoaded = true;
            }
        )
    }

    ngOnDestroy() {
        if (this.sub) this.sub.unsubscribe()
    }

    private setOriginalEvents() {
        this.filteredEvents = this.events.slice();
    }

    calculateChartData(): void {
        this.chartData = [];
        this.categories.forEach(cat => {
            const catEvent = this.filteredEvents.filter(e => e.category === cat.id && e.type === 'outcome');
            this.chartData.push(
                {
                    name: cat.name,
                    value: catEvent.reduce((total, item) => total += item.amount, 0)
                })
        })
    }

    private toggleFilterVisibility(dir: boolean) {
        this.isFilterVisible = dir;
    }

    openFilter() {
        this.toggleFilterVisibility(true)
    }

    onFilterCancel() {
        this.toggleFilterVisibility(false);
        this.setOriginalEvents();
        this.calculateChartData();
    }

    onFilterApply(filterData) {
        this.toggleFilterVisibility(false);
        this.setOriginalEvents();

        const startPeriod = moment().startOf(filterData.period).startOf('d');
        const endPeriod = moment().endOf(filterData.period).endOf('d');

        this.filteredEvents = this.filteredEvents
            .filter(e => filterData.types.includes(e.type))
            .filter(e => filterData.categories.includes(e.category.toString()))
            .filter(e => {
                const momentDate = moment(e.date, 'DD.MM.YYYY HH:mm:ss');
                return momentDate.isBetween(startPeriod, endPeriod)
            });
        this.calculateChartData()
    }

}
