import { Component } from '@angular/core';
import { EarthquakeVisualizerComponent } from '../earthquake-visualizer/earthquake-visualizer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-mars',
  standalone: true,
  imports: [EarthquakeVisualizerComponent, SidebarComponent],
  templateUrl: './mars.component.html',
  styleUrl: './mars.component.sass'
})
export class MarsComponent {

}
