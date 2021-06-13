function radians(degrees) {
    return (degrees * Math.PI) / 180;
}

function showError(message) {
    const errorMessage = 'error: ' + message;
    console.log(errorMessage);

    const messageHolder = document.querySelector('#errorMessage');
    messageHolder.textContent = errorMessage;
} 

let g_gl = null;

function startup() {
    const stage = document.querySelector('#stage');
    const gl = stage.getContext('webgl2');
    if (!gl) {
        showError('failed to get webgl2 context');
        return;
    }
    g_gl = gl;

    //gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.4, 0.0);

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, g_vertex_shader);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, g_fragment_shader);
    const program = createProgram(gl, vertexShader, fragmentShader);

    const matrix = gl.getUniformLocation(program, "MVP");

    const projection = mat4_perspective(radians(45), 4 / 3, 0.1, 100);
    
    const eye = [4, 3 ,3];
    const center =  [0, 0, 0];
    const up = [0, 1, 0];
    const view = mat4_look_at(eye, center, up);

    const model = mat4_identity();
    const mvp = mat4_mul(mat4_mul(view, projection), model);

    const vertex_buffer_data = [
        -1.0, -1.0, -1.0,
        -1.0, -1.0, 1.0,
        -1.0,  1.0, 1.0,

         1.0,  1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0, -1.0,

         1.0,-1.0, 1.0,
        -1.0,-1.0,-1.0,
         1.0,-1.0,-1.0,
        
         1.0, 1.0,-1.0,
         1.0,-1.0,-1.0,
        -1.0,-1.0,-1.0,
    
        -1.0,-1.0,-1.0,
        -1.0, 1.0, 1.0,
        -1.0, 1.0,-1.0,
    
         1.0,-1.0, 1.0,
        -1.0,-1.0, 1.0,
        -1.0,-1.0,-1.0,
    
        -1.0, 1.0, 1.0,
        -1.0,-1.0, 1.0,
         1.0,-1.0, 1.0,
    
         1.0, 1.0, 1.0,
         1.0,-1.0,-1.0,
         1.0, 1.0,-1.0,
    
         1.0,-1.0,-1.0,
         1.0, 1.0, 1.0,
         1.0,-1.0, 1.0,
    
         1.0, 1.0, 1.0,
         1.0, 1.0,-1.0,
        -1.0, 1.0,-1.0,
    
         1.0, 1.0, 1.0,
        -1.0, 1.0,-1.0,
        -1.0, 1.0, 1.0,
    
         1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,
         1.0,-1.0, 1.0
    ];

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

    const a = 0.325;
    const uv_buffer_data = [
        0 * a, (0 * a),
        0 * a, (1 * a),
        1 * a, (1 * a),

        3 * a, (0 * a),
        2 * a, (1 * a),
        3 * a, (1 * a),

        2 * a, (1 * a),
        1 * a, (2 * a),
        2 * a, (2 * a),

        3 * a, (0 *a),
        2 * a, (0 * a),
        2 * a, (1 * a),

        0 * a, (0 * a),
        1 * a, (1 *a),
        1 * a, (0 * a),

        2 * a, (1 * a),
        1 * a, (1* a),
        1 * a, (2*a),

        3 * a, (2 * a),
        3 * a, (1 * a),
        2 * a, (1 * a),

        2 * a, (0 * a),
        1 * a, (1 * a),
        2 * a, (1 * a),

        1 * a, (1 * a),
        2 * a, (0 * a),
        1 * a, (0 * a),

        0 * a, (1 * a),
        0 * a, (2 * a),
        1 * a, (2 * a),

        0 * a, (1 * a),
        1 * a, (2 * a),
        1 * a, (1 * a),

        2 * a, (2 * a),
        3 * a, (2 * a),
        2 * a, (1 * a)
    ];   

    const uv_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uv_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv_buffer_data), gl.STATIC_DRAW);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    // ----

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);

    gl.uniformMatrix4fv(matrix, false, new Float32Array(mvp));

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    //gl.uniformli(texture_id, 0);

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

}
