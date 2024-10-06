import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

@Component({
  selector: 'app-earthquake-visualizer',
  templateUrl: './earthquake-visualizer.component.html',
  styleUrls: ['./earthquake-visualizer.component.sass'],
  standalone: true,
  imports: [CommonModule]
})
export class EarthquakeVisualizerComponent implements AfterViewInit {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;

  @Input() planet: string = ''

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

  // Simulating dummy backend data for latitudes and longitudes
  private latitudes = [34.05, 48.85, -15.78]; // Sample latitudes
  private longitudes = [-118.25, 2.35, -47.93]; // Sample longitudes

  ngAfterViewInit(): void {
    this.initScene();
    this.addMarkersOnPlanet();
    this.animate();

    this.canvas = this.renderer.domElement;

    // Add event listeners for mouse move and click
    this.canvas.addEventListener('mousemove', (event) => this.onMouseMove(event));
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
    const radius = 5; // Planet radius
    const markerGeometry = new THREE.SphereGeometry(0.1, 32, 32); // Increased marker size for easier clicking
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
  
    // Iterate over the earthquake data
    for (const { id, lat, long } of this.earthquakeData) {
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
      marker.userData = { lat, long };
  
      // Enable raycasting and interactions on this marker
      marker.name = `Marker-${id}`; // Use the ID for the marker name
  
      // Add the marker to the markers array
      this.markers.push(marker);
  
      // Add the marker to the scene
      this.scene.add(marker);
    }
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

    if (intersects.length > 0) {
      // Change cursor to pointer if hovering over a marker
      this.canvas.style.cursor = 'pointer';
    } else {
      // Change cursor back to default if not hovering over any markers
      this.canvas.style.cursor = 'default';
    }
  }

  private onMouseClick(event: MouseEvent) {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // Check for intersections with the markers
    const intersects = this.raycaster.intersectObjects(this.markers);

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      const { lat, long } = intersectedObject.userData;
      console.log(`Marker clicked at latitude: ${lat}, longitude: ${long}`);
    } else {
      console.log('No marker clicked');
    }
  }

  private targetPosition = new THREE.Vector3();
private isFocusing = false;

focusOnMarker(index: number) {
  const marker = this.markers[index];
  if (marker) {
    // Set the target position to the marker's position
    this.targetPosition.copy(marker.position).add(new THREE.Vector3(2, 2, 2)); // Adjust the offset as needed

    // Start focusing
    this.isFocusing = true;
    this.animateFocus();
  }
}

private animateFocus() {
  if (this.isFocusing) {
    // Interpolate camera position towards the target position
    this.camera.position.lerp(this.targetPosition, 0.1); // Adjust the lerp factor for speed

    // Make the camera look at the target position
    this.camera.lookAt(this.targetPosition);

    // Check if the camera is close enough to the target position to stop focusing
    const distance = this.camera.position.distanceTo(this.targetPosition);
    console.log(distance);
    
    if (distance < 0.1) {
      this.isFocusing = false; // Stop focusing once close enough
    }

    // Continue the animation loop
    requestAnimationFrame(() => this.animateFocus());
  }
}
}
