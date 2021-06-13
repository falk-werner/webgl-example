function vec3_dot(a, b) {
    return (a[0] * b[0]) +
        (a[1] * b[1]) +
        (a[2] * b[2]);
}

function vec3_add(a, b) {
    return [
        a[0] + b[0],
        a[1] + b[1],
        a[2] + b[2]
    ];
}

function vec3_sub(a, b) {
    return [
        a[0] - b[0],
        a[1] - b[1],
        a[2] - b[2]
    ];
}

function vec3_mul_scalar(vector, value) {
    return [
        vector[0] * value,
        vector[1] * value,
        vector[2] * value
    ];
}

function vec3_normalize(vector) {
    const a = Math.sqrt(
        (vector[0] * vector[0]) +
        (vector[1] * vector[1]) +
        (vector[2] * vector[2])
    );

    if (0 != a) {
        return [
            vector[0] / a,
            vector[1] / a,
            vector[2] / a
        ];
    }
    else {
        return vector;
    }
}

function vec3_cross(a, b) {
    return [
        ((a[1] * b[2]) - (a[2] * b[1])),
        ((a[2] * b[0]) - (a[0] * b[2])),
        ((a[0] * b[1]) - (a[1] * b[0]))
    ];
}

