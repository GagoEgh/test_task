import { Injectable } from "@angular/core";
import { ListInterface } from "../interfaces/list.interface";

@Injectable({
    providedIn: 'root'
})
export class UpdateDateService {

    private database!:IDBDatabase;

    constructor(){
        this.initializeDatabase()
    }

    private initializeDatabase() {
        const request = indexedDB.open('state', 1);

        request.onsuccess = (event: Event) => {
            this.database = (event.target as IDBOpenDBRequest).result;
            console.log("Database initialized successfully!");
        };

        request.onerror = (event: Event) => {
            console.error("Error initializing database:", (event.target as IDBRequest).error);
        };
    }

    public updateDate(item:ListInterface){

        if (!this.database) {
            console.error("Database is not initialized yet!");
            return;
        }

        const objectStore = this.database.transaction('list', 'readwrite').objectStore('list');
        const request = objectStore.get(item.name);
        
        request.onsuccess = (event: Event) => {
            const result = (event.target as IDBRequest).result;

            if (result) {
                result.choice = item.choice
                const updateRequest = objectStore.put(result);
                updateRequest.onsuccess = () => {
                    console.log("Record updated successfully!");
                };

                updateRequest.onerror = (err) => {
                    console.error("Error updating record:", err);
                };
            } else {
                console.log("No record found with the given key.");
            }
        };

        request.onerror = (event: Event) => {
            console.error("Error retrieving record:", (event.target as IDBRequest).error);
        };
    }

    public updateAll(list:ListInterface[]){
        if (!this.database) {
            console.error("Database is not initialized yet!");
            return;
        }

        const objectStore = this.database.transaction('list', 'readwrite').objectStore('list');
        const request = objectStore.getAll();

        request.onsuccess = (event: Event) => {
            const result = (event.target as IDBRequest).result;

            if (result) {
                list.forEach((item)=>{
                    const updateRequest = objectStore.put(item);
                    updateRequest.onsuccess = () => {
                        console.log("Record updated successfully!");
                    };
    
                    updateRequest.onerror = (err) => {
                        console.error("Error updating record:", err);
                    };
                })
         
            } else {
                console.log("No record found with the given key.");
            }
        };
    }
    
}


