import * as THREE from "./vendor/three.module.min.js";

// Size of the open-frame navigation markers. Labels stay crisp at every size.
// 1 = full marker size, 0.75 = 25% smaller, 0.5 = half size.
const NAV_SHAPE_SCALE = 0.75;

// Solid square-section struts keep every silhouette faceted and sharp.
function buildCenterpiece(id, material) {
  const centerpiece = new THREE.Group();
  const parts = [];
  const strut = new THREE.BoxGeometry(1, 1, 1);
  const up = new THREE.Vector3(0, 1, 0);
  function frame(geometry, thickness, color) {
    const edges = new THREE.EdgesGeometry(geometry);
    const vertices = edges.attributes.position;
    const shape = new THREE.Group();
    const surface = material(color);
    for (let i = 0; i < vertices.count; i += 2) {
      const start = new THREE.Vector3().fromBufferAttribute(vertices, i);
      const end = new THREE.Vector3().fromBufferAttribute(vertices, i + 1);
      const direction = end.clone().sub(start);
      const beam = new THREE.Mesh(strut, surface);
      beam.position.copy(start).add(end).multiplyScalar(0.5);
      beam.scale.set(thickness, direction.length() + thickness, thickness);
      beam.quaternion.setFromUnitVectors(up, direction.normalize());
      shape.add(beam);
    }
    geometry.dispose();
    edges.dispose();
    return shape;
  }
  function polygonLoop(sides, radius, thickness, depth, color) {
    const shape = new THREE.Shape();
    const hole = new THREE.Path();
    for (let i = 0; i <= sides; i++) {
      const angle = (i / sides) * Math.PI * 2 + Math.PI / 2;
      const innerAngle = (-i / sides) * Math.PI * 2 + Math.PI / 2;
      const action = i === 0 ? "moveTo" : "lineTo";
      shape[action](Math.cos(angle) * radius, Math.sin(angle) * radius);
      hole[action](
        Math.cos(innerAngle) * (radius - thickness),
        Math.sin(innerAngle) * (radius - thickness),
      );
    }
    shape.holes.push(hole);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: false,
      steps: 1,
      curveSegments: 1,
    });
    geometry.translate(0, 0, -depth / 2);
    return new THREE.Mesh(geometry, material(color));
  }
  const palette = [0x386af3, 0x6b49df, 0x7b9fff];
  if (id === "home") {
    // Each rotating part fits inside the next frame in every orientation.
    [1.7, 0.75, 0.29].forEach((size, i) => {
      const part = frame(
        new THREE.BoxGeometry(size, size, size),
        0.11 - i * 0.018,
        palette[i],
      );
      parts.push(part);
      centerpiece.add(part);
    });
  } else if (id === "work") {
    // The middle circumsphere fits inside the outer diamond's inscribed opening.
    [1.45, 0.75, 0.34].forEach((radius, i) => {
      const part = polygonLoop(
        4,
        radius,
        [0.16, 0.1, 0.06][i],
        0.08,
        palette[i],
      );
      parts.push(part);
      centerpiece.add(part);
    });
  } else if (id === "projects") {
    // Triangle openings reserve clearance for unrestricted inner rotations.
    [1.5, 0.58, 0.18].forEach((radius, i) => {
      const part = polygonLoop(
        3,
        radius,
        [0.14, 0.09, 0.04][i],
        0.06,
        palette[i],
      );
      parts.push(part);
      centerpiece.add(part);
    });
  } else {
    // An octahedral cage, a counter-rotating cube, and a faceted crystal core.
    const outer = frame(new THREE.OctahedronGeometry(1.15), 0.075, palette[0]);
    const inner = frame(
      new THREE.BoxGeometry(0.64, 0.64, 0.64),
      0.06,
      palette[1],
    );
    const crystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.2),
      material(palette[2]),
    );
    parts.push(outer, inner, crystal);
    centerpiece.add(...parts);
  }
  centerpiece.userData.parts = parts;
  return centerpiece;
}

// A small open frame gives each stop a 3D identity without a solid text plaque.
function markerGeometry(index) {
  if (index % 3 === 0) return new THREE.BoxGeometry(0.52, 0.52, 0.52);
  if (index % 3 === 1) return new THREE.OctahedronGeometry(0.39);
  return new THREE.TetrahedronGeometry(0.42);
}

// One renderer, a bounded pixel ratio, and a loop that sleeps offscreen.
export function createOrbitalScene(isPaused) {
  const canvas = document.createElement("canvas");
  canvas.className = "journey-canvas";
  canvas.setAttribute("aria-hidden", "true");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.autoClear = false;
  document.body.append(canvas);

  // Matte color with diffuse shading, without glossy reflections or clearcoat.
  const matte = (color) =>
    new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0,
      roughness: 1,
      clearcoat: 0,
      specularIntensity: 0,
      envMapIntensity: 0,
    });
  const raycaster = new THREE.Raycaster();
  const projected = new THREE.Vector3();
  const pointer = new THREE.Vector2();
  const views = new Map();
  let frame = 0,
    time = 0,
    last = 0,
    lost = false;
  let width = 0,
    height = 0;

  document.querySelectorAll("[data-scene]").forEach((host) => {
    const id = host.dataset.scene;
    const labels = [...host.querySelectorAll("[data-node]")];
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xc2d4ff, 0x171127, 1.8));
    const key = new THREE.DirectionalLight(0xd3e5ff, 1.4);
    key.position.set(-3, 4, 5);
    scene.add(key);
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    camera.position.set(0, 0, 8.5);
    const group = new THREE.Group();
    scene.add(group);
    const centerpiece = buildCenterpiece(id, matte);
    centerpiece.rotation.set(0.3, -0.3, -0.4);
    group.add(centerpiece);
    host.classList.add("orbit-dial");
    const rings = new THREE.Group();
    // An instrument-like perimeter replaces the tangle of crossing orbits and spokes.
    const circumference = new THREE.Mesh(
      new THREE.TorusGeometry(2.55, 0.006, 4, 160),
      new THREE.MeshBasicMaterial({
        color: 0x6481b2,
        transparent: true,
        opacity: 0.26,
      }),
    );
    circumference.position.z = -0.45;
    rings.add(circumference);
    const ticks = [];
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      const inner = i % 5 === 0 ? 2.66 : 2.69;
      ticks.push(
        Math.cos(angle) * inner,
        Math.sin(angle) * inner,
        -0.45,
        Math.cos(angle) * 2.72,
        Math.sin(angle) * 2.72,
        -0.45,
      );
    }
    const tickGeometry = new THREE.BufferGeometry();
    tickGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(ticks, 3),
    );
    rings.add(
      new THREE.LineSegments(
        tickGeometry,
        new THREE.LineBasicMaterial({
          color: 0x728ab1,
          transparent: true,
          opacity: 0.28,
        }),
      ),
    );
    group.add(rings);
    const focusArc = new THREE.Mesh(
      new THREE.TorusGeometry(2.55, 0.018, 5, 32, 0.32),
      new THREE.MeshBasicMaterial({
        color: 0x729bff,
        transparent: true,
        opacity: 0.85,
      }),
    );
    focusArc.position.z = -0.45;
    group.add(focusArc);
    const nodes = labels.map((label, i) => {
      const name = label.textContent.replace(/[↗↘]/g, "").trim();
      const text = document.createElement("span");
      text.className = "dial-label";
      text.textContent = name;
      label.replaceChildren(text);
      // The transparent hit sphere makes the thin marker easy to select by raycast.
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 8, 6),
        new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0,
          depthWrite: false,
        }),
      );
      const marker = new THREE.LineSegments(
        new THREE.EdgesGeometry(markerGeometry(i)),
        new THREE.LineBasicMaterial({
          color: 0x728ab1,
          transparent: true,
          opacity: 0.7,
        }),
      );
      mesh.add(marker);
      const core = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.085),
        new THREE.MeshBasicMaterial({ color: 0x8bb1ff }),
      );
      mesh.add(core);
      mesh.scale.setScalar(NAV_SHAPE_SCALE);
      mesh.userData.index = i;
      group.add(mesh);
      return { mesh, marker, core, label };
    });
    const view = {
      id,
      host,
      scene,
      camera,
      group,
      centerpiece,
      rings,
      nodes,
      focusArc,
      selected: 0,
      rotation: 0,
      targetRotation: 0,
      hover: -1,
      pointer: { x: 0, y: 0 },
      eased: { x: 0, y: 0 },
      visible: false,
    };
    views.set(id, view);
    function hit(event) {
      const rect = host.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        (-(event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      scene.updateMatrixWorld(true);
      camera.updateMatrixWorld(true);
      raycaster.setFromCamera(pointer, camera);
      return (
        raycaster.intersectObjects(
          nodes.map((node) => node.mesh),
          false,
        )[0]?.object.userData.index ?? -1
      );
    }
    host.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      const rect = host.getBoundingClientRect();
      view.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      view.pointer.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      view.hover = hit(event);
      host.style.cursor = view.hover >= 0 ? "pointer" : "";
      if (isPaused()) refresh();
    });
    host.addEventListener("pointerleave", () => {
      view.pointer.x = view.pointer.y = 0;
      view.hover = -1;
      host.style.cursor = "";
      refresh();
    });
    host.addEventListener("click", (event) => {
      if (event.target.closest("a,button")) return;
      const index = hit(event);
      if (index >= 0) labels[index].click();
    });
    labels.forEach((label, i) => {
      label.addEventListener("pointerenter", () => {
        view.hover = i;
        refresh();
      });
      label.addEventListener("pointerleave", () => {
        view.hover = -1;
        refresh();
      });
      label.addEventListener("focus", () => {
        view.hover = i;
        refresh();
      });
      label.addEventListener("blur", () => {
        view.hover = -1;
        refresh();
      });
      if (id === "home")
        label.addEventListener("click", () => select("home", i));
    });
  });

  function positionNodes(view, dt) {
    const { id, nodes, group } = view;
    const paused = isPaused();
    const mix = paused ? 1 : 1 - Math.exp(-dt * 7);
    view.rotation += (view.targetRotation - view.rotation) * mix;
    view.eased.x += (view.pointer.x - view.eased.x) * mix;
    view.eased.y += (view.pointer.y - view.eased.y) * mix;
    const entry = Math.max(
      -1,
      Math.min(1, view.host.getBoundingClientRect().top / window.innerHeight),
    );
    group.rotation.set(
      paused ? 0 : view.eased.y * 0.1 + entry * 0.13,
      paused ? 0 : view.eased.x * 0.12,
      0,
    );
    view.centerpiece.rotation.y = time * 0.15 + view.rotation * 0.45;
    view.centerpiece.rotation.z = -0.4 + view.rotation * 0.2;
    view.centerpiece.userData.parts.forEach((part, index) => {
      const direction = index % 2 === 0 ? 1 : -1;
      part.rotation.set(
        time * 0.18 * direction + (index * Math.PI) / 3,
        time * 0.22 * direction + (index * Math.PI) / 4,
        time * 0.12 + (index * Math.PI) / 5,
      );
    });
    view.rings.rotation.z = -view.rotation;
    view.focusArc.rotation.z =
      (view.selected * Math.PI * 2) / nodes.length +
      (id === "about" ? Math.PI / 4 : Math.PI / 2) -
      view.rotation -
      0.16;
    nodes.forEach((node, i) => {
      // Fixed-radius paths keep selectors outside the sculpture's rotation envelope.
      // Interpolate the orbit angle, never a chord through the centerpiece.
      const angle =
        (i * Math.PI * 2) / nodes.length +
        (id === "about" ? Math.PI / 4 : Math.PI / 2) -
        view.rotation;
      const radius = 2.55;
      node.mesh.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0.15,
      );
      node.mesh.rotation.set(
        paused ? 0.3 : time * 0.15 + i * 0.4,
        paused ? 0.4 : time * 0.18 + i * 0.3,
        0.2,
      );
      const selected = i === view.selected,
        hovered = i === view.hover;
      const targetScale =
        NAV_SHAPE_SCALE * (hovered ? 1.05 : selected ? 1.02 : 1);
      node.mesh.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        mix,
      );
      node.marker.material.color.setHex(
        selected || hovered ? 0xa6c6ff : 0x728ab1,
      );
      node.marker.material.opacity = selected || hovered ? 1 : 0.7;
      node.core.visible = selected || hovered;
      node.label.classList.toggle("is-active", selected);
      node.label.classList.toggle("is-hovered", hovered);
    });
  }
  function render(now = 0) {
    frame = 0;
    if (lost || document.hidden) return;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
    last = now;
    if (!isPaused()) time += dt;
    const rect = canvas.getBoundingClientRect();
    if (width !== rect.width || height !== rect.height) {
      width = rect.width;
      height = rect.height;
      renderer.setSize(width, height, false);
    }
    renderer.setScissorTest(false);
    renderer.clear(true, true, true);
    renderer.setScissorTest(true);
    let anyVisible = false;
    views.forEach((view) => {
      const bounds = view.host.getBoundingClientRect();
      view.visible =
        bounds.bottom > 0 && bounds.top < height && bounds.width > 0;
      if (!view.visible) return;
      anyVisible = true;
      view.camera.aspect = bounds.width / bounds.height;
      view.camera.position.z = Math.max(
        view.id === "about" ? 9.8 : 12,
        11.7 / view.camera.aspect,
      );
      view.camera.updateProjectionMatrix();
      positionNodes(view, dt);
      const bottom = height - bounds.bottom;
      renderer.setViewport(bounds.left, bottom, bounds.width, bounds.height);
      renderer.setScissor(
        Math.max(0, bounds.left),
        Math.max(0, bottom),
        Math.min(bounds.right, width) - Math.max(0, bounds.left),
        Math.min(bounds.bottom, height) - Math.max(0, bounds.top),
      );
      renderer.render(view.scene, view.camera);
      view.nodes.forEach((node) => {
        // Keep type upright and unwarped while the 3D dial turns behind it.
        node.mesh.getWorldPosition(projected).project(view.camera);
        const x = (projected.x * 0.5 + 0.5) * bounds.width;
        const y = (-projected.y * 0.5 + 0.5) * bounds.height;
        const labelWidth = node.label.offsetWidth;
        const vertical = Math.max(
          -1,
          Math.min(1, (y - bounds.height / 2) / (bounds.height * 0.18)),
        );
        const sideOffset =
          Math.sign(x - bounds.width / 2) *
          (labelWidth / 2 + 14) *
          (1 - Math.abs(vertical));
        const labelX = Math.max(
          labelWidth / 2 + 8,
          Math.min(bounds.width - labelWidth / 2 - 8, x + sideOffset),
        );
        node.label.style.left = labelX + "px";
        node.label.style.top = y + vertical * 27 + "px";
      });
      view.host.classList.add("scene-ready");
    });
    if (anyVisible && !isPaused()) frame = requestAnimationFrame(render);
  }
  function refresh() {
    if (!frame && !lost && !document.hidden) {
      last = 0;
      frame = requestAnimationFrame(render);
    }
  }
  function select(id, index) {
    const view = views.get(id);
    if (!view) return;
    view.selected = index;
    let target = (index * Math.PI * 2) / view.nodes.length;
    while (target - view.rotation > Math.PI) target -= Math.PI * 2;
    while (target - view.rotation < -Math.PI) target += Math.PI * 2;
    view.targetRotation = target;
    refresh();
  }
  window.addEventListener("scroll", refresh, { passive: true });
  window.addEventListener("resize", refresh, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else refresh();
  });
  const resizeObserver = new ResizeObserver(refresh);
  views.forEach((view) => resizeObserver.observe(view.host));
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(frame);
    frame = 0;
    views.forEach((view) => view.host.classList.remove("scene-ready"));
    canvas.style.opacity = "0";
  });
  canvas.addEventListener("webglcontextrestored", () => {
    lost = false;
    canvas.style.opacity = "1";
    refresh();
  });
  document.fonts?.ready.then(refresh);
  refresh();
  return { refresh, select };
}
