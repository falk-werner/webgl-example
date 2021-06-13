const g_fragment_shader = `#version 300 es

precision highp float;

in vec2 UV;
out vec4 color;

uniform sampler2D myTextureSampler;

void main()
{
    color = texture(myTextureSampler, UV);
    // color = vec4(1, 0, 0, 1);
}

`;