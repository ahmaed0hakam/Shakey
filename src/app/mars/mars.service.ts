import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MarsService {

    constructor(
        private http: HttpClient,
    ) { }

    getQuakes(params: any): Observable<any[]> {
        return this.http.get<any[]>(`https://ahmad/api/quakes`, { params: params });
    }    


}