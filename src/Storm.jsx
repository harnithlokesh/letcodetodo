import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  uniform float uTime; attribute float aScale; attribute float aNoise; varying float vMix;
  void main(){ vec3 p=position; float t=uTime*1.25+aNoise*6.283;
    p*=1.0+sin(t)*0.10; float a=uTime*.05+aNoise*6.283;
    p.xz=mat2(cos(a),-sin(a),sin(a),cos(a))*p.xz;
    vMix=length(position)/2.5; vec4 mv=modelViewMatrix*vec4(p,1.0);
    gl_PointSize=(42.0*aScale)/-mv.z; gl_Position=projectionMatrix*mv; }`;
const fragmentShader = `
  varying float vMix; void main(){ vec2 uv=gl_PointCoord-.5; float d=length(uv); if(d>.5) discard;
    float s=pow(1.-d*2.,4.); vec3 c=mix(vec3(.05,.05,.05),vec3(.69,.37,.17),smoothstep(.25,.85,vMix));
    c=mix(c,vec3(.81,.50,.28),smoothstep(.72,1.,vMix)); gl_FragColor=vec4(c*1.25,s*.9); }`;

function Plasma(){
  const points = useRef();
  const geometry = useMemo(() => {
    const count = 9000, positions = new Float32Array(count * 3), scale = new Float32Array(count), noise = new Float32Array(count);
    for(let i=0;i<count;i++) { let u,v,s; do {u=Math.random()*2-1;v=Math.random()*2-1;s=u*u+v*v} while(s>=1||s===0);
      const f=2*Math.sqrt(1-s), r=2.5*(.55+Math.pow(Math.random(),.4)*.45), j=i*3;
      positions[j]=u*f*r; positions[j+1]=v*f*r; positions[j+2]=(1-2*s)*r; scale[i]=.4+Math.random()*.85; noise[i]=Math.random(); }
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.BufferAttribute(positions,3)); g.setAttribute('aScale',new THREE.BufferAttribute(scale,1)); g.setAttribute('aNoise',new THREE.BufferAttribute(noise,1)); return g;
  }, []);
  const material = useMemo(() => new THREE.ShaderMaterial({ uniforms:{uTime:{value:0}}, vertexShader, fragmentShader, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending }), []);
  useFrame(({clock, pointer}) => { material.uniforms.uTime.value=clock.elapsedTime; points.current.rotation.y+=.002; points.current.rotation.x=Math.sin(clock.elapsedTime*.18)*.13; points.current.position.x=pointer.x*.22; points.current.position.y=pointer.y*.16; });
  return <points ref={points} geometry={geometry} material={material} />;
}

function Rings(){ const ring=useRef(); useFrame(({clock})=>{ring.current.rotation.z=clock.elapsedTime*.12; ring.current.rotation.x=.8+Math.sin(clock.elapsedTime*.25)*.12}); return <group ref={ring}><mesh><torusGeometry args={[3.35,.012,8,130]}/><meshBasicMaterial color="#b15f2c" transparent opacity={.72}/></mesh><mesh rotation={[.9,0,1.1]}><torusGeometry args={[3.05,.008,8,130]}/><meshBasicMaterial color="#111111" transparent opacity={.45}/></mesh></group> }

export default function Storm(){ return <div className="storm" aria-hidden="true"><Canvas dpr={[1,1.5]} camera={{position:[0,0,7],fov:45}} gl={{alpha:true,antialias:true}}><Plasma/><Rings/><ambientLight intensity={.2}/></Canvas></div> }
