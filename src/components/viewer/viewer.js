import React from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { MESH_DEFAULT_COLOR, MESH_HIGHLIGHT_COLOR } from '../../config.js';
import SideBar from './sidebar/sidebar.js';
import MeshLoader from '../../utils/meshLoader.js';
import './viewer.css';

export default class Viewer extends React.Component {
    constructor(){
        super()
        this.sideBar = React.createRef();
        this.state = {
            selectedObjects: []
        };
    }

    componentDidMount() {

        this.renderer = new THREE.WebGLRenderer({alpha:true});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.mount.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
        this.camera.position.set( 0, 0, 5 );

        this.orbitControls = new OrbitControls( this.camera, this.renderer.domElement );

        var dLight = new THREE.DirectionalLight(0xffffff, 1);
        dLight.position.set = (0, 0, 5);

        this.scene = new THREE.Scene();
        this.scene.add( this.camera );
        this.scene.add( new THREE.AmbientLight( 0x333333 ) );
        this.scene.add(dLight);

        const meshLoader = new MeshLoader();
        meshLoader.onError = () => console.log("error");
        meshLoader.onProgress = (event) => console.log( ( event.loaded / event.total * 100 ) + '% loaded' );
        meshLoader.onLoad = this.addMeshToScene;
        this.meshLoader = meshLoader;

        window.addEventListener( 'resize', this.onWindowResize, false );

        this.onWindowResize();
        this.animate();
    }

    addMeshToScene = (geometry, fileName) => {
        const material = new THREE.MeshStandardMaterial( { color: MESH_DEFAULT_COLOR, flatShading: true } );
        const mesh = new THREE.Mesh( geometry, material );
        mesh.name = fileName;
        this.scene.add(mesh);
        this.sideBar.current.addToSceneList(mesh);
    }

    removeObjectsByUUID = (uuidsToRemove) => {
        for (let uuid of uuidsToRemove) {
            const object = this.scene.getObjectByProperty("uuid", uuid);
            if (object) {
                object.geometry.dispose();
                object.material.dispose();
                this.scene.remove( object );    
            }    
        }
    }

    setColorOfObjects = (objects, color) => {
        for (let uuid of objects) {
            const object = this.scene.getObjectByProperty("uuid", uuid);
            if (object && object.material) {
                object.material.color.setHex(color);
            }        
        }
    }

    onSelectionChanged = (event) => {
        var prevSelection = [...this.state.selectedObjects];
        var currentSelection = [];
        var uuidsToSelect = [];
        var uuidsToDeselect = [];

        for (let selection of event.target.selectedOptions) {
            if (selection) {
                currentSelection.push(selection.value);
                if (!prevSelection.includes(selection.value)) {
                    uuidsToSelect.push(selection.value);
                }
            }
        }

        for (var selection of prevSelection) {
            if (!currentSelection.includes(selection)) {
                uuidsToDeselect.push(selection);
            }
        }

        this.setState({
            selectedObjects: currentSelection
        });

        this.setColorOfObjects(uuidsToDeselect, MESH_DEFAULT_COLOR);
        this.setColorOfObjects(uuidsToSelect, MESH_HIGHLIGHT_COLOR);
    }

    onWindowResize = () => {
        let width = window.innerWidth;
        let height = window.innerHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( width, height );
    }

    animate = () => {
        requestAnimationFrame( this.animate );
        this.render3D();
    }

    render3D = () => {
        this.renderer.render( this.scene, this.camera );
    }

    onFileSelectedForUpload = (event) => {
        let file = event.target.files[0];
        this.meshLoader.LoadFile(file);
    }

    render = function () {
        return (
            <div className="viewer">
                <SideBar 
                    ref={this.sideBar}
                    onFileSelected={this.onFileSelectedForUpload}
                    onItemsRemoved={this.removeObjectsByUUID}
                    onSelectionChanged={this.onSelectionChanged}
                />
                <div className="window-3d noselect" ref={(mount) => { this.mount = mount }} />
            </div>
        )
    }
}