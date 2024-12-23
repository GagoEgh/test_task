import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IndexDBService } from './services/indexDB.service';
import { CommonModule } from '@angular/common';
import { ListInterface } from './interfaces/list.interface';
import { UpdateDateService } from './services/updateDate.service';
import { ClickOutsideDirective } from './directive/click-outside.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,ClickOutsideDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent{
  private db = inject(IndexDBService);
  private updateDateService  = inject(UpdateDateService);

  public list = this.db.list;
  public isOpen = signal(false);
  public isChecked = this.db.isChecked;
  public isExpanded = signal(false);
  public selectionCount=signal(0);
  public  isClickOutside = signal(false);


  public toggleCategory(id: number): void {
    const item = this.list().find(cat=>cat.id ===id);
    if (item) {
      item.expanded = !item.expanded;
    }
  }

  public openList():void{
    this.isOpen.set(true)
  }

  public selectAllItems():void{
    this.list().forEach(item=>item.choice=true);
    this.updateDateService.updateAll(this.list());
    this.isChecked.set(true)
  }

  public toggleItemSelection(event:Event,item:ListInterface){
    const isChecked = (event.target as HTMLInputElement).checked;
    item.choice = isChecked;
    this.updateDateService.updateDate(item);
    this.isChecked.set(this.list().some(item => item.choice));
  }

  public deselectAllItems(){
    this.list().forEach(item=>item.choice=false);
    this.updateDateService.updateAll(this.list());
    this.isChecked.set(false)
  }
 
  public clickOutside(): void {
    if (this.isExpanded()) {
      this.isExpanded.set(false);
      this.isOpen.set(false);
      this.selectionCount.set(this.list().filter(item => item.choice).length);
      this.isClickOutside.set(true);
    }
  }

  public toggleList(): void {
    this.isExpanded.update(expanded => !expanded);
  }

  public  addedMinMaxClass(item:any){
    return {
      'container_list-minHeight':!item.expanded,
      'container_list-maxHeight':item.expanded
    }
  }

  public  expandCollapse(item:any){
    return {
      'container_list-itemData':item.expanded,
      'itemData': !item.expanded
    }
  }
}
