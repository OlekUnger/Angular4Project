import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: '<div class="loader-animator"></div>',
  styleUrls: ['./loader.component.sass']
})
export class LoaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
