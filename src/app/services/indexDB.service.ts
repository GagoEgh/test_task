import { Injectable, signal, WritableSignal } from "@angular/core";
import { list } from "../defolt_object/list_object";

@Injectable({
    providedIn: 'root'
})
export class IndexDBService {
    private listData = list;
    private openRequest = indexedDB.open('state',1);
    private dateBase!:IDBDatabase;

    public list:WritableSignal<any[]> = signal([]);
    
    constructor(){
        this.initializeDatabase();
    }

    private async initializeDatabase(): Promise<void> {
        this.openRequest.onupgradeneeded = (event: Event) => this.upgrade(event);
        this.openRequest.onsuccess = async (event: Event) => await this.onSuccess(event);
        this.openRequest.onerror = () => console.error('Database initialization error');
        console.log('eeee',this.list())
    }

    private async onSuccess(event: Event): Promise<any> {
        const target = event.target as IDBOpenDBRequest;
        this.dateBase = target.result;
        const result = await this.fetchAll();
        this.list.set(result);
       
    }

    private fetchAll(): Promise<any[]> {
        return new Promise((resolve, reject) => {
          const transaction = this.dateBase.transaction('list', 'readonly');
          const objectStore = transaction.objectStore('list');
          const request = objectStore.getAll();
      
          request.onsuccess = (event: Event) => {
            const target = event.target as IDBRequest;
            resolve(target.result);
          };
      
          request.onerror = (event: Event) => {
            const target = event.target as IDBRequest;
            reject(target.error);
          };
        });
    }

    private upgrade(event: Event): void {
        const target = event.target as IDBOpenDBRequest;
        this.dateBase = target.result;
    
        if (!this.dateBase.objectStoreNames.contains('list')) {
          const objectStore = this.dateBase.createObjectStore('list', { keyPath: 'name' });
          this.listData.forEach((data) => {
                objectStore.add(data);
            });
        }
    }

}