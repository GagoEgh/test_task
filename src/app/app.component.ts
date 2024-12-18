import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IndexDBService } from './services/indexDB.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent{
  db = inject(IndexDBService);
  cdr = inject(ChangeDetectorRef)

  categories = [
    { id: 1, name: 'Категория 1', expanded: false, items: ['Элемент 1.1', 'Элемент 1.2'] },
    { id: 2, name: 'Категория 2', expanded: false, items: ['Элемент 2.1', 'Элемент 2.2'] },
    { id: 3, name: 'Категория 3', expanded: false, items: ['Элемент 3.1', 'Элемент 3.2'] },
  ];

  list = this.db.list;

  toggleCategory(id: number): void {
    const category = this.categories.find(cat => cat.id === id);
    if (category) {
      category.expanded = !category.expanded;
    }
  }
}
