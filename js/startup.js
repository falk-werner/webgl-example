function radians(degrees) {
    return (degrees * Math.PI) / 180;
}

function showError(message) {
    const errorMessage = 'error: ' + message;
    console.log(errorMessage);

    const messageHolder = document.querySelector('#errorMessage');
    messageHolder.textContent = errorMessage;
} 

async function loadModel(url) {
    const response = await fetch(url);
    const contents = await response.text();
    return new Promise((resolve, reject) => {
        try {
            const model = WavefrontObject.parse(contents);
            resolve(model);
        }
        catch (err) {
            reject(err);
        }
    });
}

let g_gl = null;
let g_model = null;

function startup() {
    loadModel('assets/sphere.obj').then((model) => {
        g_model = model;
        main();
    }).catch((err) => {
        showError(err);
    });
}

function main() {
    const stage = document.querySelector('#stage');
    const gl = stage.getContext('webgl2');
    if (!gl) {
        showError('failed to get webgl2 context');
        return;
    }
    g_gl = gl;

    //gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.1, 1.0);

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, g_vertex_shader);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, g_fragment_shader);
    const program = createProgram(gl, vertexShader, fragmentShader);

    const matrix = gl.getUniformLocation(program, "MVP");

    const vertex_buffer_data = g_model.getVertexBuffer();

    const vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_buffer_data), gl.STATIC_DRAW);

    const vertex_array = gl.createVertexArray();
    gl.bindVertexArray(vertex_array);

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(
        0,
        3,
        gl.FLOAT,
        false,
        0,
        0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const cube_image = document.querySelector('#cube');
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cube_image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);

    const texture_id = gl.getUniformLocation(program, "myTextureSampler");

    const uv_buffer_data = g_model.getUVBuffer();
    const uv_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv_buffer_data), gl.STATIC_DRAW);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);


    const draw = () => {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
    
        const projection = mat4_perspective(radians(45), 4 / 3, 0.1, 100);

        const currentTime = Date.now() * 0.0005;

        const eye = [2 * Math.sin(currentTime), 1.8, -2 * Math.cos(currentTime)];
        const center =  [0, 0, 0];
        const up = [0, 1, 0];
        const view = mat4_look_at(eye, center, up);
    
        const model = mat4_identity();
        const mvp = mat4_mul(mat4_mul(view, projection), model);

        gl.uniformMatrix4fv(matrix, false, new Float32Array(mvp));
    
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
    
        gl.enableVertexAttribArray(1);
        gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
        gl.vertexAttribPointer(
            1,
            2,
            gl.FLOAT,
            gl.FLOAT,
            0,
            0);
    
        gl.drawArrays(gl.TRIANGLES, 0, vertex_buffer_data.length / 3);
        gl.flush();

        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);
 
 
}
