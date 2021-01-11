import React, { useRef } from 'react';
import { useLoader } from 'react-three-fiber';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

const Mesh = function (props) {

    const onLoadProgress = (event) => {
        console.log("loading");
    }

    const group = useRef()

    const { nodes, materials } = useLoader(DRACOLoader, props.url, onLoadProgress);

    return (
        <group ref={group} {...props} dispose={null}>
            <group rotation={[-Math.PI / 2, 0, 0]}>
                <group position={[0, 0.02, -6.33]} rotation={[0.24, -0.55, 0.56]} scale={[7, 7, 7]}>
                <mesh material={materials.scene} geometry={nodes['planet.001_1'].geometry} />
                <mesh material={materials.scene} geometry={nodes['planet.001_2'].geometry} />
                </group>
            </group>
        </group>
    )
}

export default Mesh;