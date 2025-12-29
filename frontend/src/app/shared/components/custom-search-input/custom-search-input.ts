import { Component, EventEmitter, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-custom-search-input',
  imports: [FormsModule, MatInputModule, MatIcon],
  templateUrl: './custom-search-input.html',
  styleUrl: './custom-search-input.scss',
})
export class CustomSearchInput {

 @Output() searchEmitter = new EventEmitter<string>();
 @Output() clearEmitter = new EventEmitter<boolean>();

  searchData = '';

  search(){
    this.searchEmitter.emit(this.searchData);
  }

  clear(){
    this.searchData = '';
    this.clearEmitter.emit(true);
  }


}
