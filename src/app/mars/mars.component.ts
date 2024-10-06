import { Component } from '@angular/core';
import { EarthquakeVisualizerComponent } from '../earthquake-visualizer/earthquake-visualizer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MarsService } from './mars.service';
import { finalize } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mars',
  standalone: true,
  imports: [EarthquakeVisualizerComponent, SidebarComponent, HttpClientModule, CommonModule],
  templateUrl: './mars.component.html',
  styleUrl: './mars.component.sass',
  providers: [MarsService]
})
export class MarsComponent {

  isLoading:  boolean = false;
  quakesData: any[] = [];

  constructor(
    private marsService: MarsService
  ){}

  getQuakes(filters: Event): void {
    let params = {
      planet:  'mars',
      ...filters
    }
    this.isLoading = true;

    this.marsService.getQuakes(params).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (data: any) => {
       this.quakesData = data;
      },
      error: (error: any) => {
        this.quakesData = [
          { id: 1, lat: 34.055161, long: -118.25 },
          { id: 2, lat: 50.56, long: -77.35 },
          { id: 3, lat: 22.05, long: -120.25 }
      ];
      }
    });
  }

}
