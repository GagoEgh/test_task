import { Injectable, signal, WritableSignal } from "@angular/core";
import { list } from "../defolt_object/list_object";

@Injectable({
    providedIn: 'root'
})
export class IndexDBService {
    private listData = list;
    private openRequest = indexedDB.open('state',1);
    private datebase!:IDBDatabase;

    public list:WritableSignal<any[]> = signal([]);
    
    constructor(){
        this.initializeDatabase();
    }

    private async initializeDatabase(): Promise<void> {
        this.openRequest.onupgradeneeded = (event: Event) => this.upgrade(event);
        this.openRequest.onsuccess = async (event: Event) => await this.onSuccess(event);
        this.openRequest.onerror = () => console.error('Database initialization error');
    }

    private async onSuccess(event: Event): Promise<any> {
        const target = event.target as IDBOpenDBRequest;
        this.datebase = target.result;
        const result = await this.fetchAll();
        this.list.set(result);
       
    }

    public updateDate(name:string){
        return new Promise((resolve, reject)=>{
            const transaction = this.datebase.transaction('list', 'readonly');
            const objectStore = transaction.objectStore('list');
            const request =  objectStore.get(name);
            request.onsuccess = (event: Event) => {
                const target = event.target as IDBRequest;
                resolve(target.result);
            };

            request.onerror = (event: Event) => {
                const target = event.target as IDBRequest;
                reject(target.error);
            };
        })
    }

    private fetchAll(): Promise<any[]> {
        return new Promise((resolve, reject) => {
          const transaction = this.datebase.transaction('list', 'readonly');
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
        this.datebase = target.result;
    
        if (!this.datebase.objectStoreNames.contains('list')) {
          const objectStore = this.datebase.createObjectStore('list', { keyPath: 'name' });
          this.listData.forEach((data) => {
                objectStore.add(data);
            });
        }
    }

}