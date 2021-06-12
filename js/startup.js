function showError(message) {
    const errorMessage = 'error: ' + message;
    console.log(errorMessage);

    const messageHolder = document.querySelector('#errorMessage');
    messageHolder.textContent = errorMessage;
} 

function startup() {
    const stage = document.querySelector('#stage');
    const gl = stage.getContext('webgl2');
    if (!gl) {
        showError('failed to get webgl2 context');
        return;
    }

    //gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.4, 0.0);

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, g_vertex_shader);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, g_fragment_shader);
    const program = createProgram(gl, vertexShader, fragmentShader);

    const vertex_buffer_data = [
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0,
         0.0,  1.0, 0.0
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


    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);


    gl.drawArrays(gl.TRIANGLES, 0, 3);

}
