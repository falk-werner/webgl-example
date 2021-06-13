function WavefrontObject() {
    this.vertexBuffer = [];
    this.uvBuffer = [];
};

WavefrontObject.prototype.getVertexBuffer = function() {
    return this.vertexBuffer;
}

WavefrontObject.prototype.getUVBuffer = function() {
    return this.uvBuffer;
}

WavefrontObject._parseFace = function (items) {
    const vertex_ids = [0, 0, 0];
    const uv_ids = [0, 0, 0];

    for(let i = 0; i < 3; i++) {
        const item = items[i + 1];
        const numbers = item.split("/");

        if (numbers.length > 0) {
            vertex_ids[i] = parseInt(numbers[0]);
        }

        if ((numbers.length > 1) && ('' != numbers[1])) {
            uv_ids[i] = parseInt(numbers[1]);
        }
    }

    return {vertex_ids, uv_ids};
}

WavefrontObject.parse = function(text) {
    const obj = new WavefrontObject();
    const lines = text.split(/\r?\n/);
    const vertices = [];
    const uv = [];
    for(let line of lines) {
        line = line.trim();
        const items = line.split(/\s+/);
        if (items.length > 0) {
            switch (items[0]) {
                case 'v':
                    vertices.push([
                        parseFloat(items[1]),
                        parseFloat(items[2]),
                        parseFloat(items[3])
                    ]);
                    break;
                case 'vt':
                    uv.push([
                        parseFloat(items[1]),
                        parseFloat(items[2])
                    ])
                    break;
                case 'f':
                    const face = WavefrontObject._parseFace(items);
                    for(let i = 0; i < 3; i++) {
                        const vertex_id = face.vertex_ids[i];
                        const vertex =  (0 < vertex_id) ? vertices[vertex_id - 1] : vertices[vertices.length  - vertex_id];
                        obj.vertexBuffer.push(vertex[0]);
                        obj.vertexBuffer.push(vertex[1]);
                        obj.vertexBuffer.push(vertex[2]);
    
                        const uv_id = face.uv_ids[i];
                        const uv_ = (0 < uv_id) ? uv[uv_id - 1] : uv[uv.length - uv_id];
                        obj.uvBuffer.push(uv_[0]);
                        obj.uvBuffer.push(1 - uv_[1]);    
                    }

                    break;
                default:
                    break;
            }
        }
    }


    return obj;
}