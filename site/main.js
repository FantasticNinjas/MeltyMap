
var canvas = document.querySelector("#map_canvas");
var gl = canvas.getContext("webgl2");
if (gl)
{
    redrawDisplay()
}
else
{
    console.log("Unable to initialize WebGL. Your browser or machine may not support it.");
}


function redrawDisplay() {

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    // Resize the drawing buffer to match the display size

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
            gl.clear(gl.COLOR_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        }
    });

    try {
        resizeObserver.observe(canvas, { box: 'device-pixel-content-box' });
    } catch {
        resizeObserver.observe(canvas, { box: 'content-box' });
    }

}

