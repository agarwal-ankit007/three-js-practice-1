import './style.css'
import * as THREE from 'three'
import { Mesh, MeshBasicMaterial, Vector3 } from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'



/**
 * debug
 */

const gui = new dat.GUI({ closed: true })

/*
textures
*/


const loadingManager = new THREE.LoadingManager()

const textureLoader = new THREE.TextureLoader(loadingManager)
//create cubeTextureLoader for environment map
const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
// const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png')
// const colorTexture = textureLoader.load('/textures/checkerboard-8x8.png')
const colorTexture = textureLoader.load('/textures/minecraft.png')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

gradientTexture.generateMipmaps = false
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter


//instead of 1, we have to give 6 images for 6 sides
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])

//find environment maps from : HDRIHaven , download it , then go to https://matheowis.github.io/HDRI-toCubeMap/

// colorTexture.generateMipmaps = false

// colorTexture.minFilter = THREE.NearestFilter
// colorTexture.magFilter = THREE.NearestFilter



/*
create a cursor to get the mouse cursor coordinates
*/
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    //divide to normalize the value btw 0 and 1 , and -0.5 to make it from -0.5 to 0.5
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)

})



//console.log(THREE);
/*
steps:
1: create the scene
2: create an object
3: provide a camera
4: provide a renderer
*/
//to create the scene
const scene = new THREE.Scene()


//objects
// const material = new THREE.MeshBasicMaterial({
//     map:colorTexture
// })

//meshBasicMaterial

// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// //material.color.set('#456321')
// material.color = new THREE.Color('#ff0')

// // material.wireframe = true

// //we can also specify opacity but we also need to set transparent to true
// //alphamap controls the transparency
// // material.opacity = 0.5
// material.transparent = true
// material.alphaMap = alphaTexture

// //side lets you decide which side of a face is visible , we can use FrontSide(default), BackSide, DoubleSide
// // material.side = THREE.FrontSide
// // material.side = THREE.BackSide
// material.side = THREE.DoubleSide

//mesh Normal material

//Normals can be used for lighting, reflection, refraction etc

// const material = new THREE.MeshNormalMaterial()
// material.side = THREE.DoubleSide
// material.flatShading = true

//meshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

//meshDepthMaterial
//const material = new THREE.MeshDepthMaterial()

//materials that react to light
//meshLamberMaterial
//const material = new THREE.MeshLambertMaterial()

//meshPhongMaterial , it also reflects light
//const material = new THREE.MeshPhongMaterial()
//we can control the reflection by using shininess
//material.shininess = 100

//we can also change color of it using specular
//material.specular = new THREE.Color(0x0000ff)


//meshToonMaterial

// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture


//meshStandardMaterial (best) , it is more realistic and has parameters like roughness and metalness
// const material = new THREE.MeshStandardMaterial()
// // material.metalness = 0.45
// // material.roughness = 0.65

// material.metalness = 0
// material.roughness = 0

// material.map = doorColorTexture
// //aoMap ('ambient occlusion map') will add shadows where the texture is dark but we must add a second set of UV named uv2
// material.aoMap = ambientOcclusionTexture
// //we can also change the intensity
// material.aoMapIntensity = 1

// //displacement map will move the vertices to create relief
// material.displacementMap = heightTexture
// //it will look terrible because it lacks vertices and the displacement is too strong
// //so add subdivisions
// material.displacementScale = 0.05

// material.metalnessMap = metalnessTexture
// material.roughnessMap = roughnessTexture

// //normal map will fake the normals orientation and add details on the surface regardless of the subdivision
// material.normalMap = normalTexture
// //we can also control the intensity (it is a vector2)
// // material.normalScale.set(0.5, 0.5)
// material.normalScale.x = 0.5
// material.normalScale.y = 0.5

// //finally we can control alpha using alphaMap , (Don't forget to use transparent = true)
// material.transparent = true
// material.alphaMap = alphaTexture

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
material.envMap = environmentMapTexture


gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001)
gui.add(material, 'wireframe')
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001)
gui.add(material.normalScale, 'x').min(0).max(10).step(0.0001).name('normalScale X')
gui.add(material.normalScale, 'y').min(0).max(10).step(0.0001).name('normalScale Y')


//mesh physical material is same as standard material but with the support for a clear coat effect

//we have points material , it is used to make particles

//ShaderMaterial and RawShaderMaterial can both be used to create your own materials

//Environment map : it is image of what's surrounding the scene
//It can be used for reflection or refraction but also for general lighting.
//it is supported by many materials but we are going to use it for MeshStandardMaterial



const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 64, 64),
    material
)
sphere.position.x = -1.5
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1, 100, 100),
    material
)

// console.log(plane.geometry.attributes.uv)
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))

const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128),
    material
)
torus.position.x = 1.5
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))

scene.add(sphere, plane, torus)

/**
 * lights
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4

scene.add(ambientLight, pointLight)

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//handle resize
window.addEventListener('resize', () => {
    //console.log('resize')
    //update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //update camera aspect ratio
    camera.aspect = sizes.width / sizes.height

    //when changing properties like aspect, we need to call the camera.updateProjectionMatrix()
    camera.updateProjectionMatrix()

    //update renderer
    renderer.setSize(sizes.width, sizes.height)

    //set pixelRatio
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

//handle fullscreen
window.addEventListener('dblclick', () => {
    // console.log('double clicked')
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    if (!fullscreenElement) {
        // console.log('go fullscreen');
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen()
        }
        else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen()
        }
    }
    else {
        // console.log('leave fullscreen');
        if (document.exitFullscreen) {
            document.exitFullscreen()
        }
        else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        }
    }

})


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)


//adjusting the camera
camera.position.z = 3

//camera.lookAt(mesh.position)

//add camera to the scene
scene.add(camera)

const canvas = document.querySelector('.webgl')

const controls = new OrbitControls(camera, canvas)

controls.enabled = true
controls.enableDamping = true


//renderer
//renders the scene on the canvas, <canvas> is an html element where you can draw

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

//update the size of the renderer
renderer.setSize(sizes.width, sizes.height)
//set pixelRatio
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


//we can also use clock
//clock
let clock = new THREE.Clock()

const tick = () => {

    //clock
    const elapsedTime = clock.getElapsedTime()

    //update objects
    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    plane.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    //update controls
    controls.update()

    //renderer
    renderer.render(scene, camera)
    //to call on each frame
    window.requestAnimationFrame(tick)
}

tick()