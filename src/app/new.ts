 // Animate method to render the scene and update controls
 animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  // Update camera and renderer when the window is resized
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Quadify function as defined in the original code
  quadify(geometry: THREE.BufferGeometry, distance: number) {
    const pos = geometry.attributes['position'];
    const quadAmount = pos.count / 6;
    
    const a1 = new THREE.Vector3(), b1 = new THREE.Vector3(), c1 = new THREE.Vector3();
    const a2 = new THREE.Vector3(), b2 = new THREE.Vector3(), c2 = new THREE.Vector3();
    const hSide = new THREE.Vector3(), vSide = new THREE.Vector3();

    for (let i = 0; i < quadAmount; i++) {
      a1.fromBufferAttribute(pos, i * 6 + 0);
      b1.fromBufferAttribute(pos, i * 6 + 1);
      c1.fromBufferAttribute(pos, i * 6 + 2);
      a2.fromBufferAttribute(pos, i * 6 + 3);
      b2.fromBufferAttribute(pos, i * 6 + 4);
      c2.fromBufferAttribute(pos, i * 6 + 5);

      vSide.subVectors(c1, a1).normalize();
      a1.addScaledVector(vSide, distance);
      c1.addScaledVector(vSide, -distance);
      c2.addScaledVector(vSide, -distance);

      vSide.subVectors(b2, a2).normalize();
      b1.addScaledVector(vSide, distance);
      a2.addScaledVector(vSide, distance);
      b2.addScaledVector(vSide, -distance);

      hSide.subVectors(b1, a1).normalize();
      a1.addScaledVector(hSide, distance);
      b1.addScaledVector(hSide, -distance);
      a2.addScaledVector(hSide, -distance);

      vSide.subVectors(c2, b2).normalize();
      b2.addScaledVector(vSide, distance);
      c2.addScaledVector(vSide, -distance);
      c1.addScaledVector(vSide, -distance);

      pos.setXYZ(i * 6 + 0, a1.x, a1.y, a1.z);
      pos.setXYZ(i * 6 + 1, b1.x, b1.y, b1.z);
      pos.setXYZ(i * 6 + 2, c1.x, c1.y, c1.z);
      pos.setXYZ(i * 6 + 3, a2.x, a2.y, a2.z);
      pos.setXYZ(i * 6 + 4, b2.x, b2.y, b2.z);
      pos.setXYZ(i * 6 + 5, c2.x, c2.y, c2.z);
    }
    
    geometry.attributes['position'].needsUpdate = true;
  }