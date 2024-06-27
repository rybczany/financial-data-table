import { Component, OnInit } from '@angular/core';
import { DataTableComponent } from './shared/data-table/data-table.component';
import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/pl';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'data-table';

  constructor() {
    registerLocaleData(localeES, 'pl');
  }

  ngOnInit() {}
}
