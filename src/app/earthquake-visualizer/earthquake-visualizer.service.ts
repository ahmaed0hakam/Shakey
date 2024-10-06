import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Earthquake {
  id: number;
  lat: number;
  long: number;
  date: string; // Date in ISO format (e.g., '2023-10-01T00:00:00Z')
}

@Injectable({
  providedIn: 'root'
})
export class EarthquakeVisualizerService {
  private apiUrl = 'https://api.example.com/earthquakes'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  // Simulated data fetching method (replace this with an actual API call)
  fetchEarthquakes(): Observable<Earthquake[]> {
    const dummyData: Earthquake[] = [
      { id: 1, lat: 34.05, long: -118.25, date: '2023-10-01T00:00:00Z' },
      { id: 2, lat: 48.85, long: 2.35, date: '2023-09-28T00:00:00Z' },
      { id: 3, lat: -15.78, long: -47.93, date: '2023-09-30T00:00:00Z' },
      // More dummy data...
    ];
    return of(dummyData); // Use of to simulate the observable response
  }

  // Method to get earthquakes within a date range
  getEarthquakesByDate(startDate: Date, endDate: Date): Observable<Earthquake[]> {
    return this.fetchEarthquakes().pipe(
      map(earthquakes =>
        earthquakes.filter(earthquake => {
          const date = new Date(earthquake.date);
          return date >= startDate && date <= endDate;
        })
      ),
      catchError(error => {
        console.error('Error fetching earthquakes:', error);
        return of([]);
      })
    );
  }
}
