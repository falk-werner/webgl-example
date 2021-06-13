function mat4_id(i, j) {
    return (i * 4) + j;
}

function mat4_zero() {
    return [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ];
}

function mat4_identity() {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
}

function mat4_perspective(field_of_view, aspect, z_near, z_far) {
    const tanHalfFovy = Math.tan(field_of_view / 2);

    matrix = mat4_zero();
    matrix[mat4_id(0, 0)] = 1 / (aspect * tanHalfFovy);
    matrix[mat4_id(1, 1)] = 1 / tanHalfFovy;
    matrix[mat4_id(2, 2)] = - (z_far + z_near) / (z_far - z_near);
    matrix[mat4_id(2, 3)] = -1;
    matrix[mat4_id(3, 2)] = - (2 * z_far * z_near) / (z_far - z_near);

    return matrix;
}

function mat4_look_at(eye, center, up) {
    const f = vec3_normalize(vec3_sub(center, eye));
    const s = vec3_normalize(vec3_cross(f, up));
    const u = vec3_cross(s, f);
    
    return [
        s[0], u[0], -f[0], 0,
        s[1], u[1], -f[1], 0,
        s[2], u[2], -f[2], 0,
        -vec3_dot(s, eye), -vec3_dot(u, eye), vec3_dot(f, eye), 1
    ];
}

function mat4_mul(matrix, other) {
    let result = mat4_zero();

    for (let i = 0; i < 4; i++)
    {
        for(let j = 0; j < 4; j++)
        {
            let sum = 0;
            for (let k = 0; k < 4; k++)
            {
                sum += (matrix[mat4_id(i, k)] * other[mat4_id(k, j)]);
            }
            result[mat4_id(i, j)] = sum;
        }
    }

    return result;
}
