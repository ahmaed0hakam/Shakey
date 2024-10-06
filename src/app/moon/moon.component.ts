import { Component } from '@angular/core';
import { EarthquakeVisualizerComponent } from '../earthquake-visualizer/earthquake-visualizer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MoonService } from './moon.service';
import { finalize } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-moon',
  standalone: true,
  imports: [EarthquakeVisualizerComponent, SidebarComponent, HttpClientModule],
  templateUrl: './moon.component.html',
  styleUrl: './moon.component.sass',
  providers: [MoonService],
})
export class MoonComponent {
  isLoading:  boolean = false;
  quakesData!: any

  constructor(
    private moonService: MoonService
  ){

  }

  getQuakes(filters: Event): void {
    this.isLoading = true;

    this.moonService.getQuakes(filters).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (data: any) => {
       this.quakesData = data;
      },
      error: (error: any) => {
        console.log("hehe")
      }
    });
  }

}
