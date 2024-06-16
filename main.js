import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import image_data_object from './img_data.json'

let renderer, scene, loader, camera, controls
let images = new THREE.Group()

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  scene = new THREE.Scene()
  scene.background = new THREE.Color('white')

  loader = new THREE.TextureLoader()
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  controls = new OrbitControls(camera, renderer.domElement)

  camera.position.z = 50
  controls.update()

  create_images()
  create_videos()
  animate()
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
      map: texture
    })
    const mesh = new THREE.Mesh(plane_geo, material)
    mesh.position.x = x_pos
    mesh.position.y = y_pos
    mesh.rotateY((Math.PI / 6) * rotation)
    images.add(mesh)
  }
  scene.add(images)
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
    console.log(image_data_object.videos[i])
    const ratio = image_data_object.videos[i].ratio
    const width = image_data_object.videos[i].width * 0.01 * ratio
    const height = image_data_object.videos[i].height * 0.01 * ratio
    const rotation = image_data_object.videos[i].rotation
    const x_pos = image_data_object.videos[i].x * 0.01 * (ratio / 2)
    const y_pos = image_data_object.videos[i].y * 0.01 * (ratio / 2)

    const plane_geo = new THREE.PlaneGeometry(width, height)
    const texture = new THREE.VideoTexture(video_element)
    const material = new THREE.MeshBasicMaterial({
      map: texture
    })
    const mesh = new THREE.Mesh(plane_geo, material)
    mesh.position.x = x_pos
    mesh.position.y = y_pos
    mesh.rotateY((Math.PI / 6) * rotation)
    images.add(mesh)
  }
  scene.add(images)
}

init()

function animate() {
  requestAnimationFrame(animate)

  const time = performance.now()

  for (let i = 0, l = images.children.length; i < l; i++) {
    const image = images.children[i]
    const scale =
      Math.sin((Math.floor(image.position.x) + time) * 0.002) * 0.01 + 1
    image.scale.set(scale, scale, scale)
  }
  renderer.render(scene, camera)
}
