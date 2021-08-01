uniform float uTime;
uniform float uScale;

attribute vec3 aRandom;

varying vec3 vPosition;

void main() 
{
    vec3 pos = position;

    float time = uTime * 4.0;
    float frequency = 0.02;

    // Particles movement
    pos.x += sin(time * aRandom.x) * frequency;
    pos.y += cos(time * aRandom.y) * frequency;
    pos.z += cos(time * aRandom.z) * frequency;

    // Transition 
    pos.x *= uScale + (sin(pos.y * 4.0 + time) * (1.0 - uScale));
    pos.y *= uScale + (sin(pos.z * 4.0 + time) * (1.0 - uScale));
    pos.z *= uScale + (sin(pos.x * 4.0 + time) * (1.0 - uScale));
    pos *= uScale;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 8.0 / -mvPosition.z;

    vPosition = position;
}