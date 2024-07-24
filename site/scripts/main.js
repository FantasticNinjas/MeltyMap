
import vertexShaderSource from './vertex.glsl.js';
import fragmentShaderSource from './fragment.glsl.js';

main()



function main() {
    var canvas = document.querySelector("#map_canvas");
    var gl = canvas.getContext("webgl2");
    if (gl)
    {
        initializeMapCanvas(canvas, gl);
    }
    else
    {
        throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
    }
}

/**
 * 
 * @param {!HTMLCanvasElement} canvas 
 * @param {!WebGL2RenderingContext} gl 
 */
function initializeMapCanvas(canvas, gl) {

    var program = buildGlProgram(gl, vertexShaderSource, fragmentShaderSource)

    // Create position buffer

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positions = [
    0, 0,
    0, 0.5,
    0.7, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Setup position attribute

    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    var positionAttrLocation = gl.getAttribLocation(program, "in_position");
    gl.enableVertexAttribArray(positionAttrLocation);
    gl.vertexAttribPointer(positionAttrLocation, 2, gl.FLOAT, false, 0, 0);


    // Start redrawing every frame

    function drawScene()
    {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

        gl.useProgram(program)
        gl.bindVertexArray(vao);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        requestAnimationFrame(drawScene);
    }

    setupAutoresizeCanvas(canvas, gl, drawScene);
    requestAnimationFrame(drawScene)

}

/**
 * 
 * @param {!HTMLCanvasElement} canvas 
 * @param {!WebGL2RenderingContext} gl 
 */
function setupAutoresizeCanvas(canvas, gl, drawCallback) {
    const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
            let width;
            let height;
            if (entry.devicePixelContentBoxSize) {
                width = entry.devicePixelContentBoxSize[0].inlineSize;
                height = entry.devicePixelContentBoxSize[0].blockSize;
            } else {
                let dpr = window.devicePixelRatio;
                width = entry.contentBoxSize[0].inlineSize * dpr;
                height = entry.contentBoxSize[0].blockSize * dpr;
            }
            
            canvas.width = width;
            canvas.height = height;

            gl.viewport(0, 0, width, height);

            drawCallback()
        }
    });

    try {
        resizeObserver.observe(canvas, { box: 'device-pixel-content-box' });
    } catch {
        resizeObserver.observe(canvas, { box: 'content-box' });
    }
}

/**
 * 
 * @param {!WebGL2RenderingContext} gl 
 * @param {string} vertexShaderSource 
 * @param {string} fragmentShaderSource 
 */
function buildGlProgram(gl, vertexShaderSource, fragmentShaderSource)
{
    let vertexShader = compileGlShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    let fragmentShader = compileGlShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    return linkGlProgram(gl, vertexShader, fragmentShader)
}

/**
 * 
 * @param {!WebGL2RenderingContext} gl 
 * @param {string} shaderSource 
 * @param {*} shaderType 
 * @returns 
 */
function compileGlShader(gl, shaderSource, shaderType) {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);

    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error("Failed to compile WebGL shader:" + gl.getShaderInfoLog(shader));
    }
   
    return shader;
}

/**
 * 
 * @param {!WebGL2RenderingContext} gl 
 * @param {!WebGLShader} vertexShader 
 * @param {!WebGLShader} fragmentShader 
 * @returns 
 */
function linkGlProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error("Failed to link WebGL program:" + gl.getProgramInfoLog(program));
    }
   
    return program;
  };