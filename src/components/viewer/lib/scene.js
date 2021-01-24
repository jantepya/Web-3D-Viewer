import * as THREE from 'three';

import SceneControls from './sceneControls.js';

export const SceneEvent = {
    "selectionChanged" : "selectionChanged",
}

export class Scene extends THREE.EventDispatcher {
    constructor(rootElement) {
        super();

        this.renderer = new THREE.WebGLRenderer({alpha:true});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        rootElement.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 5000);
        this.camera.position.set( 0, 0, 5 );

        this.controls = new SceneControls( this.camera, this.renderer.domElement );

        var dLight = new THREE.DirectionalLight(0xffffff, 1);
        dLight.position.set = this.camera.position;
        this.camera.add(dLight);

        this.meshRoot = new THREE.AmbientLight( 0x333333 );

        this.scene = new THREE.Scene();
        this.scene.add( this.camera );
        this.scene.add( this.meshRoot );

        this.renderer.domElement.addEventListener( 'click', this.onClick, false );

        this.resize(this.renderer.domElement.clientWidth, this.renderer.domElement.clientHeight);
        this.animate();
    }

    onClick = (event) => {
        event.preventDefault();

        var mouse = new THREE.Vector2();
        var rect = this.renderer.domElement.getBoundingClientRect();
        mouse.x = ( (event.clientX - rect.left) / (rect.right - rect.left) ) * 2 - 1;
        mouse.y = -( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

        var raycaster =  new THREE.Raycaster();                                        
        raycaster.setFromCamera( mouse, this.camera );
        var intersects = raycaster.intersectObjects( this.meshRoot.children );

        var selection = intersects.length > 0 ? [intersects[0].object.uuid] : [];
        this.dispatchEvent({
            type: SceneEvent.selectionChanged,
            selection: selection
        });
    }

    removeObjectsByUUID = (uuidsToRemove) => {
        for (let uuid of uuidsToRemove) {
            const object = this.scene.getObjectByProperty("uuid", uuid);
            if (object) {
                object.geometry.dispose();
                object.material.dispose();
                this.meshRoot.remove( object );    
            }
        }
    }

    setColorOfObjects = (uuids, color) => {
        for (let uuid of uuids) {
            const object = this.scene.getObjectByProperty("uuid", uuid);
            if (object && object.material) {
                object.material.color.setHex(color);
            }        
        }
    }

    setVisibilityOfObjects = (uuids, isVisible) => {
        for (let uuid of uuids) {
            const object = this.scene.getObjectByProperty("uuid", uuid);
            if (object) {
                object.visible = isVisible;
            }        
        }
    }

    resize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( width, height );
    }

    animate = () => {
        this.render();
        requestAnimationFrame( this.animate );
    }

    render() {
        this.renderer.render( this.scene, this.camera );
    }
}