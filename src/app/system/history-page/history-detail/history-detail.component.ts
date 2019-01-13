import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {EventService} from "../../shared/services/event.srvice";
import {CategoriesService} from "../../shared/services/categories.service";
import {Eevent} from "../../shared/models/event.model";
import {Category} from "../../shared/models/category.model";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'app-history-detail',
    templateUrl: './history-detail.component.html',
    styleUrls: ['./history-detail.component.sass']
})
export class HistoryDetailComponent implements OnInit, OnDestroy {
    event: Eevent;
    category: Category;
    isLoaded = false;
    sub: Subscription;

    constructor(private route: ActivatedRoute,
                private eventService: EventService,
                private categoriesService: CategoriesService) {
    }

    ngOnInit() {
        this.sub = this.route.params
            .mergeMap((params: Params)=>this.eventService.getEventById(params.id))
            .mergeMap((event: Eevent)=>{
                this.event = event;
                return this.categoriesService.getCategoryById(event.category)
            }).subscribe((category: Category)=> {
                this.category = category;
                this.isLoaded = true;
            })
    }

    ngOnDestroy() {
        if(this.sub) this.sub.unsubscribe()
    }

}
