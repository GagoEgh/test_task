import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IndexDBService } from './services/indexDB.service';
import { CommonModule } from '@angular/common';
import { ListInterface } from './interfaces/list.interface';
import { UpdateDateService } from './services/updateDate.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent{
  private db = inject(IndexDBService);
  private updateDateService  = inject(UpdateDateService);
  public list = this.db.list;
  public isOpen = signal(false);
  public choiceAll = signal(false);
  public isChecked = signal(false)

  public toggleCategory(id: number): void {
    const item = this.list().find(cat=>cat.id ===id);
    if (item) {
      item.expanded = !item.expanded;
    }

  }

  public openList():void{
    this.isOpen.update((value)=>value=true)
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

  public changeAll(){
    this.choiceAll.set(true)
    this.list().forEach(item=>item.choice=true);
    this.updateDateService.updateAll(this.list())
  }

  public  change(event:Event,item:ListInterface){
    const isChecked = (event.target as HTMLInputElement).checked;
   
    if(isChecked){
      this.isChecked.set(true)
    }
    item.choice= !item.choice;

    this.updateDateService.updateDate(item);
  }
 
}
