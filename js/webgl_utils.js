function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    else {
        const infoLog = gl.getShaderInfoLog(shader);
        console.log(infoLog);
        gl.deleteShader(shader);
        throw new Error("failed to create shader: " + infoLog);
    }
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    else {
        const infoLog = gl.getProgramInfoLog(program);
        console.log(infoLog);
        gl.deleteProgram(program);
        throw new Error("failed to create program: " + infoLog);
    }
}