import { Component } from '@angular/core';
import { EarthquakeVisualizerComponent } from '../earthquake-visualizer/earthquake-visualizer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MoonService } from './moon.service';
import { finalize } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-moon',
  standalone: true,
  imports: [EarthquakeVisualizerComponent, SidebarComponent, HttpClientModule, CommonModule],
  templateUrl: './moon.component.html',
  styleUrl: './moon.component.sass',
  providers: [MoonService],
})
export class MoonComponent {
  isLoading:  boolean = false;
  quakesData: any[] = [];

  constructor(
    private moonService: MoonService
  ){

  }

  getQuakes(filters: Event): void {
    let params = {
      planet:  'mars',
      ...filters
    }

    this.isLoading = true;

    this.moonService.getQuakes(params).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (data: any) => {
       this.quakesData = data;
      },
      error: (error: any) => {
        this.quakesData = [
          { id: 1, lat: -34.055161, long: -118.25 },
          { id: 2, lat: 20.055161, long: -118.25 },
          { id: 3, lat: 19.05, long: -120.25 }
      ];
      }
    });
  }

}
