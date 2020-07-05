const m4 = twgl.m4;
const canvas = document.querySelector("#canvas")
const gl = canvas.getContext("webgl");

function getExternalScriptSource(id) {
    const script = document.getElementById(id)
    var xhr = new XMLHttpRequest();
    xhr.open("GET", script.src, false)
    xhr.send(null);
    return xhr.responseText;
}
const vsSource = getExternalScriptSource('vs')
const fsSource = getExternalScriptSource('fs')

const programInfo = twgl.createProgramInfo(gl, [vsSource, fsSource]);

// shit should be looking like that in the end:
/* class WebGLCuboid {
    constructor(width, height, depth) {
        
    }
} */

const arrays = {
    position: [
        1, 1, -1,
        1, 1, 1,
        1, -1, 1,
        1, -1, -1,
        
        -1, 1, 1,
        -1, 1, -1,
        -1, -1, -1,
        -1, -1, 1,
        
        -1, 1, 1,
        1, 1, 1,
        1, 1, -1,
        -1, 1, -1,
        
        -1, -1, -1,
        1, -1, -1,
        1, -1, 1,
        -1, -1, 1,

        1, 1, 1,
        -1, 1, 1,
        -1, -1, 1,
        1, -1, 1,
        
        -1, 1, -1,
        1, 1, -1,
        1, -1, -1,
        -1, -1, -1
    ],
    normal: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1],
    texcoord: [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
    indices: [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23],
};
const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

const defaultSrc = () => {
    return [
        // rgba
        ...[255, 255, 255, 255], // top left
        ...[192, 192, 192, 255], // top right
        ...[192, 192, 192, 255], // bottom left
        ...[255, 255, 255, 255], // bottom right
    ]
}

const tex = twgl.createTexture(gl, {
    min: gl.NEAREST,
    mag: gl.NEAREST,
    src: defaultSrc()
});

const uniforms = {
    u_lightWorldPos: [1, 8, -10],
    u_lightColor: [1, 0.8, 0.8, 1],
    u_ambient: [0, 0, 0, 1],
    u_specular: [1, 1, 1, 1],
    u_shininess: 50,
    u_specularFactor: 1,
    u_diffuse: tex,
};

let playing = true

let worldRotation = [0, 0, 0]

let lastTime = 0

var MatType = Float32Array

function render(time) {
    time *= 0.001;

    const deltaTime = lastTime - time

    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fov = 30 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.5;
    const zFar = 10;
    const projection = m4.perspective(fov, aspect, zNear, zFar);
    const eye = [1, 4, -6];
    const target = [0, 0, 0];
    const up = [0, 1, 0];

    const camera = m4.lookAt(eye, target, up);
    const view = m4.inverse(camera);
    const viewProjection = m4.multiply(projection, view);

    if (playing) worldRotation[1] += deltaTime

    // const world = m4.rotationY(worldRotation[1])

    let world = m4.rotationX(worldRotation[0])
    m4.rotateY(world, worldRotation[1], world)
    m4.rotateZ(world, worldRotation[2], world)

    uniforms.u_viewInverse = camera;
    uniforms.u_world = world;
    uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world));
    uniforms.u_worldViewProjection = m4.multiply(viewProjection, world);

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    gl.drawElements(gl.TRIANGLES, bufferInfo.numElements, gl.UNSIGNED_SHORT, 0);

    lastTime = time

    requestAnimationFrame(render);
}
requestAnimationFrame(render);

window.addEventListener('keydown', event => {
    const c = event.keyCode
    const shift = event.shiftKey
    const m = 0.2
    console.log(c);
    switch (c) {
        case 32:
            playing = !playing
            if(playing) requestAnimationFrame(render)
            break;
    
        case 88:
            if (shift) worldRotation[0] -= m; else worldRotation[0] += m
            //rotate positive x
        case 89:
            if (shift) worldRotation[1] -= m; else worldRotation[1] += m
            // rotate positive y
        case 90:
            if (shift) worldRotation[2] -= m; else worldRotation[2] += m
            // rotate postive z
        default:
            break;
    }
    requestAnimationFrame(render)
}, false)