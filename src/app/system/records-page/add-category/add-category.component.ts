import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {NgForm} from "@angular/forms";
import {CategoriesService} from "../../shared/services/categories.service";
import {Category} from "../../shared/models/category.model";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'app-add-category',
    templateUrl: './add-category.component.html',
    styleUrls: ['./add-category.component.sass']
})
export class AddCategoryComponent implements OnInit, OnDestroy {
    @Output() onCategoryAdd = new EventEmitter<Category>();
    sub: Subscription;

    constructor(private categoriesService: CategoriesService) {
    }

    ngOnInit() {}

    ngOnDestroy() {
        if(this.sub) this.sub.unsubscribe()
    }

    onSubmit(form: NgForm) {
        let {name, capacity} = form.value;
        if(capacity < 0) capacity = Math.abs(capacity);
        const category = new Category(name, capacity);

        this.sub = this.categoriesService.addCategory(category).subscribe(
            (category: Category)=>{
                form.reset();
                form.form.patchValue({capacity: 1});
                this.onCategoryAdd.emit(category)
            }
        )
    }

}
