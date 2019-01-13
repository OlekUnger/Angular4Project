import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Category} from "../../shared/models/category.model";

@Component({
    selector: 'app-history-filter',
    templateUrl: './history-filter.component.html',
    styleUrls: ['./history-filter.component.sass']
})
export class HistoryFilterComponent {
    @Output() onFilterCancel = new EventEmitter<any>();
    @Output() onFilterApply = new EventEmitter<any>();
    @Input() categories: Category[] = [];

    selectedPeriod = 'd';
    selectedTypes = [];
    selectedCategories = [];
    timePeriods = [
        {type: 'd', label: 'день'},
        {type: 'w', label: 'неделя'},
        {type: 'M', label: 'месяц'}
    ];
    types = [
        {type: 'income', label: 'Доход'},
        {type: 'outcome', label: 'Расход'},
    ];

    closeFilter() {
        this.selectedCategories = [];
        this.selectedTypes = [];
        this.selectedPeriod = 'd';
        this.onFilterCancel.emit()
    }

    private calculateInputParams(field: string, checked: boolean, value: string) {
        if (checked) {
            !this[field].includes(value) ? this[field].push(value) : null;
        } else {
            this[field] = this[field].filter(item => item !== value);
            this[field] = Array.from(new Set(this[field]));
        }
    }

    handleChangeType({checked, value}) {
        this.calculateInputParams('selectedTypes', checked, value)

    }

    handleChangeCategory({checked, value}) {
        this.calculateInputParams('selectedCategories', checked, value)
    }

    applyFilter() {
        this.onFilterApply.emit({
            types: this.selectedTypes,
            categories: this.selectedCategories,
            period: this.selectedPeriod
        })
    }

}
