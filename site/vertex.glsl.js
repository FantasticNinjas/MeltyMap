export default /*glsl*/ `#version 300 es

in vec4 in_position;

void main() {
    gl_Position = in_position;
}
`;