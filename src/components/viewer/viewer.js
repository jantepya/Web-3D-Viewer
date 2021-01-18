import React from 'react';
import * as THREE from 'three';

import { MESH_DEFAULT_COLOR, MESH_HIGHLIGHT_COLOR } from '../../config.js';
import SideBar from './sidebar/sidebar.js';
import MeshLoader from './lib/meshLoader.js';
import { Scene } from './lib/scene.js';
import './viewer.css';

const STATUS_TYPE = {
    "Info": 0,
    "Process": 1,
    "Error": 2
}

class ObjectInfo {
    constructor(name) {
        this.selected = false;
        this.visible = false;
        this.name = name;
    }
}

export default class Viewer extends React.Component {
    constructor(){
        super()
        this.sideBar = React.createRef();
        this.state = {
            status: null,
            sceneObjects: {}
        };
    }

    componentDidMount() {
        this.scene = new Scene(this.mount);
        this.scene.addEventListener("selectionChanged", (e) => this.setObjectsSelected(e.selection));

        const meshLoader = new MeshLoader();
        meshLoader.onError = this.onLoadError;
        meshLoader.onProgress = this.onLoadProgress;
        meshLoader.onLoad = this.addMeshToScene;
        this.meshLoader = meshLoader;

        window.addEventListener( 'resize', this.onWindowResize, false );
    }

    addMeshToScene = (geometry, fileName) => {
        console.log(fileName + " loaded!");
        const material = new THREE.MeshStandardMaterial( { color: MESH_DEFAULT_COLOR, flatShading: true } );
        const mesh = new THREE.Mesh( geometry, material );
        mesh.name = fileName;
        this.scene.meshRoot.add(mesh);

        var info = new ObjectInfo(fileName);
        var uuid = mesh.uuid;
        const sceneObjects = { ...this.state.sceneObjects, [uuid] : info };

        this.setState({
            sceneObjects: sceneObjects,
            status: {
                type: STATUS_TYPE.Info,
                message: "Loaded: " + fileName
            }
        });
    }

    onLoadError = (error) => {
        console.log(error);
        this.setState({
            status: {
                type: STATUS_TYPE.Error,
                message: "An error occurred..."
            }
        });
    }

    onLoadProgress = (event) => {
        console.log( ( event.loaded / event.total * 100 ) + '% loaded' )
    }

    onObjectsRemoved = (uuids) => {
        this.scene.removeObjectsByUUID(uuids);

        const sceneObjects = {...this.state.sceneObjects};

        for (let uuid of uuids) {
            delete sceneObjects[uuid];
        }

        this.setState({
            sceneObjects: sceneObjects
        });
    }

    setObjectsSelected = (newSelection) => {
        const sceneObjects = this.state.sceneObjects;
        var uuidsToSelect = [];
        var uuidsToDeselect = [];

        for (let selection of newSelection) {
            if (selection in sceneObjects && !sceneObjects[selection].selected) {
                uuidsToSelect.push(selection);
            }
        }

        Object.keys(sceneObjects).forEach((key) => {
            if (newSelection.includes(key)) {
                sceneObjects[key].selected = true;
            }
            else {
                if (sceneObjects[key].selected) {
                    uuidsToDeselect.push(key);
                }
                sceneObjects[key].selected = false;
            }
        });

        this.setState({
            selectedObjects: sceneObjects
        });

        this.scene.setColorOfObjects(uuidsToDeselect, MESH_DEFAULT_COLOR);
        this.scene.setColorOfObjects(uuidsToSelect, MESH_HIGHLIGHT_COLOR);
    }

    onWindowResize = () => {
        if (this.mount) {
            let width = this.mount.clientWidth;
            let height = this.mount.clientHeight;
            this.scene.resize(width, height);
        }
    }

    onFileSelectedForUpload = (event) => {
        let file = event.target.files[0];
        this.meshLoader.LoadFile(file);
        this.setState({
            status: {
                type: STATUS_TYPE.Process,
                message: "Loading..."
            }
        });
    }

    render = function () {
        return (
            <div className="viewer">
                <SideBar 
                    ref={this.sideBar}
                    onFileSelected={this.onFileSelectedForUpload}
                    onSelectionChanged={this.setObjectsSelected}
                    sceneObjects={this.state.sceneObjects}
                />
                <div className="window-3d noselect" ref={(mount) => { this.mount = mount }}>
                    { this.state.status?.message &&
                        <div className="status">

                            {this.state.status.type === STATUS_TYPE.Process &&
                                <img src={process.env.PUBLIC_URL  + "/spinner.gif"} alt="o" width="40px" />
                            }

                            {this.state.status.type === STATUS_TYPE.Error &&
                                <img src={process.env.PUBLIC_URL  + "/error.png"} alt="o" width="16px" />
                            }

                            <span>{this.state.status.message}</span>
                        </div>
                    }
                </div>
            </div>
        )
    }
}