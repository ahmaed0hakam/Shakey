import { Component } from '@angular/core';
import { EarthquakeVisualizerComponent } from '../earthquake-visualizer/earthquake-visualizer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-moon',
  standalone: true,
  imports: [EarthquakeVisualizerComponent, SidebarComponent],
  templateUrl: './moon.component.html',
  styleUrl: './moon.component.sass'
})
export class MoonComponent {

}
