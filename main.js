import * as THREE from 'three'
import { TrackballControls } from 'three/addons/controls/TrackballControls.js'
import TWEEN from '@tweenjs/tween.js'
import image_data_object from './img_data.json'

let renderer, scene, loader, camera, controls, raycaster, pointer
let images = new THREE.Group()

let states = new THREE.Group()
let calvin_klein = new THREE.Group()
let material_good = new THREE.Group()
let noah = new THREE.Group()
let saturday = new THREE.Group()
let partow = new THREE.Group()
let piaule = new THREE.Group()

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  scene = new THREE.Scene()
  // scene.background = new THREE.Color('white')

  loader = new THREE.TextureLoader()
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  raycaster = new THREE.Raycaster()
  pointer = new THREE.Vector2()

  controls = new TrackballControls(camera, renderer.domElement)

  camera.position.z = 50
  controls.update()

  window.addEventListener('resize', on_window_resize, false)
  window.addEventListener('click', on_click)

  create_images()
  create_videos()
  scene.add(images)
  animate()
}

function on_window_resize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function on_click(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
  raycaster.setFromCamera(pointer, camera)
  const intersects = raycaster.intersectObjects(scene.children)
  for (let i = 0; i < intersects.length; i++) {
    let selected_project_array = get_object3d_from_project_inverse(
      intersects[i].object.userData.project
    )
    selected_project_array.map((object3d) => {
      // Tween background color
      new TWEEN.Tween(object3d.material).to({ opacity: 0.025 }, 500).start()
      console.log(object3d)
    })
  }
}

// Custom functions
function get_project_from_string(project) {
  switch (project) {
    case 'states':
      return states
    case 'calvin_klein':
      return calvin_klein
    case 'material_good':
      return material_good
    case 'noah':
      return noah
    case 'saturday':
      return saturday
    case 'partow':
      return partow
    case 'piaule':
      return piaule
    case '?':
      return images
  }
}

function get_object3d_from_project(project) {
  let object3d_array = []
  for (let i = 0; i < images.children.length; i++) {
    if (images.children[i].userData.project == project) {
      object3d_array.push(images.children[i])
    }
  }
  return object3d_array
}

function get_object3d_from_project_inverse(project) {
  let object3d_array = []
  for (let i = 0; i < images.children.length; i++) {
    if (images.children[i].userData.project != project) {
      object3d_array.push(images.children[i])
    }
  }
  return object3d_array
}

function create_images() {
  for (let i = 0; i < image_data_object.images.length; i++) {
    const ratio = image_data_object.images[i].ratio
    const width = image_data_object.images[i].width * 0.01 * ratio
    const height = image_data_object.images[i].height * 0.01 * ratio
    const rotation = image_data_object.images[i].rotation
    const x_pos = image_data_object.images[i].x * 0.01 * (ratio / 2)
    const y_pos = image_data_object.images[i].y * 0.01 * (ratio / 2)

    const plane_geo = new THREE.PlaneGeometry(width, height)
    const texture = loader.load(
      `images/${image_data_object.images[i].image_title}`
    )
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true
    })
    const mesh = new THREE.Mesh(plane_geo, material)

    mesh.position.x = x_pos
    mesh.position.y = y_pos
    mesh.rotateY((Math.PI / 6) * rotation)

    mesh.userData = { project: image_data_object.images[i].project }

    images.add(mesh)
  }
}

function create_videos() {
  for (let i = 0; i < image_data_object.videos.length; i++) {
    const video_element = document.createElement('video')
    video_element.src = `videos/${image_data_object.videos[i].image_title}`
    video_element.loop = true
    video_element.playsInline = true
    video_element.muted = 'muted'
    video_element.play()
    video_element.setAttribute('id', `${i}`)

    const ratio = image_data_object.videos[i].ratio
    const width = image_data_object.videos[i].width * 0.01 * ratio
    const height = image_data_object.videos[i].height * 0.01 * ratio
    const rotation = image_data_object.videos[i].rotation
    const x_pos = image_data_object.videos[i].x * 0.01
    const y_pos = image_data_object.videos[i].y * 0.01

    const plane_geo = new THREE.PlaneGeometry(width, height)
    const texture = new THREE.VideoTexture(video_element)
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true
    })
    const mesh = new THREE.Mesh(plane_geo, material)

    mesh.position.x = x_pos
    mesh.position.y = y_pos
    mesh.rotateY((Math.PI / 6) * rotation)

    mesh.userData = { project: image_data_object.videos[i].project }

    images.add(mesh)
  }
}

init()

function animate() {
  requestAnimationFrame(animate)
  controls.update()
  TWEEN.update()

  const time = performance.now()

  for (let i = 0, l = images.children.length; i < l; i++) {
    const image = images.children[i]
    const scale =
      Math.sin((Math.floor(image.position.x) + time) * 0.002) * 0.01 + 1
    image.scale.set(scale, scale, scale)
    const randomFactor = (Math.random() - 0.5) * 0.005
    image.rotateY(Math.sin(time * (0.001 + randomFactor)) * 0.001)
  }
  renderer.render(scene, camera)
}
