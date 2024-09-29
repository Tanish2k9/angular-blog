import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-pagination',
  standalone: true,
  imports: [],
  templateUrl: './custom-pagination.component.html',
  styleUrl: './custom-pagination.component.css'
})
export class CustomPaginationComponent {
  @Output() sentPageNumber = new EventEmitter<any>();

  @Input() pageNumber:number=0;
  @Input() pageSize:number = 6;
  @Input() lastPage:boolean = false;
  @Input() totalElements:number=0;
  @Input() totalPages:number = 1;

  diablePreviousBtn():boolean{
    if(this.pageNumber ===0 ){
      return true;
    }else{
      return false;
    }
  }
  disableNextBtn():boolean{
    if((this.pageNumber === this.totalPages-1) ||(this.totalPages === 0) ){
      return true;
    }else{
      return false;
    }
  }

  increasePageNumber(){
    this.pageNumber = this.pageNumber + 1;
    this.sentPageNumber.emit(this.pageNumber);
  }
  decreasePageNumber(){
    if(this.pageNumber >0){
      this.pageNumber = this.pageNumber -1;
      this.sentPageNumber.emit(this.pageNumber);
    }
  }
}
