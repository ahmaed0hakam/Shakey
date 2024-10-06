import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MarkerDetailsModal } from './marker-details-modal/marker-details-modal.component';


@Component({
  selector: 'app-earthquake-visualizer',
  templateUrl: './earthquake-visualizer.component.html',
  styleUrls: ['./earthquake-visualizer.component.sass'],
  standalone: true,
  imports: [CommonModule, MatMenuModule]
})
export class EarthquakeVisualizerComponent implements AfterViewInit {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;

  @Input() planet: string = '';
  @Input() quakesData: any;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private Earth!: THREE.Mesh;
  private textureLoader = new THREE.TextureLoader();

  private earthquakeData = [
    { id: 1, lat: 34.055161, long: -118.25 },
    { id: 2, lat: 48.85588, long: 2.35 },
    { id: 3, lat: 34.05, long: -120.25 }
  ];

  markers: THREE.Mesh[] = [];
  private canvas!: HTMLCanvasElement;

  selectedMarker: any;

  // Simulating dummy backend data for latitudes and longitudes
  private latitudes = [34.05, 48.85, -15.78]; // Sample latitudes
  private longitudes = [-118.25, 2.35, -47.93]; // Sample longitudes

  constructor(private dialog: MatDialog) {

  }

  ngAfterViewInit(): void {
    this.initScene();
    this.addMarkersOnPlanet(); // This will be modified to conditionally add markers
    this.animate();

    this.canvas = this.renderer.domElement;

    // Add event listeners for mouse move and click
    this.canvas.addEventListener('mouseenter', (event) => this.onMouseMove(event));
    this.canvas.addEventListener('click', (event) => this.isFocusing = false);
}

  private initScene() {
    this.scene = new THREE.Scene();

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.set(0, 0, 10);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.canvasContainer.nativeElement.appendChild(this.renderer.domElement);

    // Add orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;
    this.controls.maxDistance = 14.02;
    this.controls.minDistance = 7.01;

    // Ambient light
    this.scene.add(new THREE.AmbientLight(0xffffff, 4));

    // Load planet texture (Moon for now)
    const texture = this.textureLoader.load(`../../assets/images/${this.planet}.jpg`);

    // Planet Geometry (Sphere)
    const planetGeometry = new THREE.SphereGeometry(5, 64, 64);
    const planetMaterial = new THREE.MeshStandardMaterial({ map: texture });
    this.Earth = new THREE.Mesh(planetGeometry, planetMaterial);
    this.scene.add(this.Earth);

    // Adjust camera and renderer on resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  private addMarkersOnPlanet() {
    // Clear existing markers if any
    this.markers.forEach(marker => this.scene.remove(marker));
    this.markers = []; // Reset the markers array

    const radius = 5; // Planet radius
    const markerGeometry = new THREE.SphereGeometry(0.1, 32, 32); // Increased marker size for easier clicking
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color

    // Check if quakesData is available and has markers
    if (this.quakesData?.length > 0) {
      for (const { lat, long, id } of this.quakesData) {
        // Convert latitude and longitude to spherical coordinates
        const phi = (90 - lat) * (Math.PI / 180); // Convert to radians
        const theta = (long + 180) * (Math.PI / 180); // Convert to radians

        // Calculate the 3D position on the sphere
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        // Create a marker mesh and set its position
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.set(x, y, z);

        // Store marker along with its latitude and longitude
        marker.userData = { lat, long, id, planet:  this.planet };


        // Enable raycasting and interactions on this marker
        marker.name = `Marker-${lat}-${long}`; // Unique name for the marker

        // Add the marker to the markers array
        this.markers.push(marker);

        // Add the marker to the scene
        this.scene.add(marker);
      }
    }
    // If no markers, the planet will still be displayed alone
  }


  private animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private onMouseMove(event: MouseEvent) {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Check for intersections with the markers
    const intersects = this.raycaster.intersectObjects(this.markers);

    this.canvas.style.cursor = 'move';

  }

  private targetPosition = new THREE.Vector3();
  private isFocusing = false;

  focusOnMarker(index: number) {
    const marker = this.markers[index];
    if (marker) {
      // Set the target position to the marker's position with an offset for a better view
      const offset = new THREE.Vector3(2, 2, 2); // Adjust the offset as needed
      this.targetPosition.copy(marker.position).add(offset);
  
      // Move the camera smoothly to the target position
      gsap.to(this.camera.position, {
        x: this.targetPosition.x,
        y: this.targetPosition.y,
        z: this.targetPosition.z,
        duration: 1, // Duration of the transition
        onUpdate: () => {
          // Update camera lookAt during the transition
          this.camera.lookAt(marker.position);
        },
        onComplete: () => {
          // Final look at the marker when the animation is complete
          this.camera.lookAt(marker.position);
          this.isFocusing = false; // Reset focusing state
        },
      });
  
      // Indicate that focusing has started
      this.isFocusing = true;
    }
    this.setNoActiveIndex();
  }

  setNoActiveIndex() {
    this.activeMenuIndex = null;
  }

  activeMenuIndex: number | null = null;

  toggleMenu(index: number) {
    if (this.activeMenuIndex === index) {
      // If the menu is already open, close it
      this.setNoActiveIndex();
    } else {
      // Open the menu for the clicked marker
      this.activeMenuIndex = index;
    }
  }

  getMarkerDetails(index: number) {
    const marker = this.markers[index];

    const dialogRef = this.dialog.open(MarkerDetailsModal, {
      // width: '300px', // Adjust width as needed
      data: marker // Pass the marker data to the modal
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.setNoActiveIndex(); // Call this if needed for other logic
    });
  }
}
