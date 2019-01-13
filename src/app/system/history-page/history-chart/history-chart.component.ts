import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-history-chart',
    templateUrl: './history-chart.component.html',
    styleUrls: ['./history-chart.component.sass']
})
export class HistoryChartComponent {
    @Input() data;
}


