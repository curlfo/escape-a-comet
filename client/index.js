import Phaser from 'phaser';
import {MainScene} from "./js/mainScene";
import {MenuScene} from "./js/menuScene";
import {GameOverScene} from './js/gameOverScene'
import RandomRG from './js/_rnd';


/*THREE*/
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js';



/*-------------*/
function generateSprite() {

    var canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;

    var context = canvas.getContext('2d');
    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(255,255,0,1)');
    gradient.addColorStop(0.4, 'rgba(64,0,0,1)');
    gradient.addColorStop(1, 'rgba(0,0,0,1)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;

}

function createPoints(geom) {
    var material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.03,
        transparent: true,
        blending: THREE.AdditiveBlending,
        map: generateSprite(),
        depthWrite: false // instead of sortParticles
    });

    var cloud = new THREE.Points(geom, material);
    return cloud;
}
/*-------------*/

let noise = new ImprovedNoise();
let scene, duck = null, points = null, positions = [], v3 = new THREE.Vector3();
const gltfLoader = new GLTFLoader();
gltfLoader.load('assets/duck.glb', (gltf) => {
    let root = gltf.scene;
    // const material_duck = new THREE.MeshBasicMaterial({color: '#090', wireframe: true});
    const material_duck = new THREE.MeshStandardMaterial({color: '#FFBA00', roughness: 0.1, metalness: 0.1/*, wireframe: true*/});
    duck = root.getObjectByName('M_duckToy_HP');
    // duck.scale.set(0.12, 0.12, 0.12);
    // duck.material = material_duck;
    // scene.add(duck);
    points = createPoints(duck.geometry);
    scene.add(points);

    let g = points.geometry;
    for (let i = 0; i < g.attributes.position.count; i++){
        v3.fromBufferAttribute(g.attributes.position, i);
        positions.push(v3.clone());
    }

    animation();
});
// const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
// const camera = new THREE.PerspectiveCamera( 65, 1280 / 800, 0.01, 10 );
// camera.position.x = -0.4;
// camera.position.y = 0.05;
// camera.position.z = 1;


const camera = new THREE.PerspectiveCamera( 65, 1280 / 800, 0.01, 20 );
camera.position.x = -0.4;
camera.position.y = 0.4;
camera.position.z = 9;

scene = new THREE.Scene();
// const light = new THREE.AmbientLight( 0xF0F0F0 ); // soft white light
const light = new THREE.PointLight( 0xFFFFFF, 1, 100 );
light.position.set( 0, 0, 1 );
scene.add( light );

const threeCanvas = document.getElementById("threeCanvas");
const renderer = new THREE.WebGLRenderer( { antialias: true, canvas: threeCanvas } );
// renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setSize( 1280, 800 );
// renderer.setAnimationLoop( animation );
document.body.appendChild( renderer.domElement );

// function animation( time ) {
//     // mesh.rotation.x = time / 2000;
//     // mesh.rotation.y = time / 1000;
//     if(duck !== null) {
//         //duck.rotation.x = time / 2000;
//         // duck.rotation.y = time / 1000;
//         duck.rotation.y = time / 500;
//     }
//     renderer.render( scene, camera );
// }
//


/*PHASER 3*/

var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 800,
    transparent: true,
    canvasStyle: "position: fixed",
    pixelArt: true,
    scene: [MenuScene, MainScene, GameOverScene]
};

new RandomRG(5);

var game = new Phaser.Game(config);





/*SOUND ANALYSER*/
let context = game.sound.destination.context;
let analyser = context.createAnalyser();
game.sound.destination.connect(analyser);
analyser.minDecibels = -140;
analyser.maxDecibels = 0;
let freqs = new Uint8Array(analyser.frequencyBinCount);
let times = new Uint8Array(analyser.frequencyBinCount);


/*ANIMATION*/
function animation(time, delta) {
    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 2048;
    analyser.getByteFrequencyData(freqs);
    analyser.getByteTimeDomainData(times);
    let width = Math.floor(1/freqs.length, 10), maxPercent = 0, sumPercents = 0, midPercent = 0;
    for (var i = 0; i < analyser.frequencyBinCount; i++) {
        let value = freqs[i];
        let percent = value / 256;
        if(percent > maxPercent) maxPercent = percent;

        sumPercents += percent;
    }

    if(analyser.frequencyBinCount > 0) midPercent = sumPercents / analyser.frequencyBinCount;
    //console.log(maxPercent + " " + midPercent);


    if(points !== null) {
        // points.rotation.x = time / 2000;
        points.rotation.y = time / 800;

        let mp = midPercent > 0 ? (Phaser.Math.Easing.Cubic.In(midPercent)) * 2 : 0;

        let g = points.geometry,
            t = midPercent > 0 ? (time / (1000 * (1 / mp))) : 1;

        positions.forEach((p, idx) => {

            let n = noise.noise(p.x + t, p.y + t, p.z + t) / ((60 * mp) + 1);

            v3.copy(p).addScaledVector(p, n);
            g.attributes.position.setXYZ(idx, v3.x, v3.y, v3.z);
        });
        g.computeVertexNormals();
        g.attributes.position.needsUpdate = true;
    }

    // render using requestAnimationFrame
    requestAnimationFrame(animation);
    renderer.render(scene, camera);
}
