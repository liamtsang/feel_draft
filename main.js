import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
const scene = new THREE.Scene()
const loader = new THREE.TextureLoader()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
const controls = new OrbitControls(camera, renderer.domElement)

let mouse = new THREE.Vector2()
let raycaster = new THREE.Raycaster()
const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
let mousePressed = false
let mousePositionIn3D = new THREE.Vector3()

function onDocumentMouseDown(event) {
  mousePressed = true
}
function onDocumentMouseUp(event) {
  mousePressed = false
}
function onDocumentMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
  raycaster.setFromCamera(mouse, camera)
  raycaster.ray.intersectPlane(planeZ, mousePositionIn3D)
}

function create_plane(texturePath) {
  const texture = loader.load('public/test/' + texturePath + '.jpg')
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
  })
  const geometry = new THREE.PlaneGeometry(1, 1, 1)
  const plane = new THREE.Mesh(geometry, material)
  plane.userData.hovered = false // Add hover state
  plane.userData.targetZ = -1 // Initial target z-position
  return plane
}

let plane_group = new THREE.Group()

function init() {
  camera.position.z = 5
  controls.update()

  document.addEventListener('mousemove', onDocumentMouseMove, false)
  document.addEventListener('mousedown', onDocumentMouseDown, false)
  document.addEventListener('mouseup', onDocumentMouseUp, false)

  const p1 = create_plane(1)
  const p2 = create_plane(2)
  const p3 = create_plane(3)
  const p4 = create_plane(4)
  const p5 = create_plane(5)

  p1.position.set(-1.25, 0, 0)
  p2.position.set(1.25, 0, 0)
  p3.position.set(0, 1.25, 0)
  p4.position.set(0, -1.25, 0)
  p5.position.set(0, 0, 0)
  plane_group.add(p1, p2, p3, p4, p5)
  scene.add(plane_group)
}

function create_10_planes() {
  for (let i = 0; i < 10; i++) {
    const plane = create_plane(i)
    scene.add(plane)
  }
}

init()

function animate() {
  requestAnimationFrame(animate)

  // Check the distance and update planes' states based on the stored mouse position
  plane_group.children.forEach((obj) => {
    const dir = new THREE.Vector3()
    dir.subVectors(obj.position, mousePositionIn3D)
    const distanceSquared = Math.pow(dir.x, 2) + Math.pow(dir.y, 2)
    const isHovering = distanceSquared < 1
    if (isHovering && !obj.userData.hovered) {
      obj.userData.hovered = true
      obj.userData.targetZ = 1
    } else if (!isHovering && obj.userData.hovered) {
      obj.userData.hovered = false
      obj.userData.targetZ = -1
    }

    // Smoothly interpolate the z-position of each plane towards its target z-position
    obj.position.z += (obj.userData.targetZ - obj.position.z) * 0.001
  })

  renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)
