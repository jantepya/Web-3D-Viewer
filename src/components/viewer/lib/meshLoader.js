import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { SUPPORTED_MESH_TYPES } from '../../../config.js';

const DRACO_DECODER_PATH = "https://www.gstatic.com/draco/versioned/decoders/1.4.1/";

const GetFileTypeFromName = function(filename) {
    var type = filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
    return SUPPORTED_MESH_TYPES[type];
}

const ReadFileAsync = function(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    })
}
  
const MeshLoader = function() {
    this.loaders = {};

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderConfig( {type:"wasm"} )
    dracoLoader.setDecoderPath( DRACO_DECODER_PATH );
    dracoLoader.preload();
    this.loaders[SUPPORTED_MESH_TYPES.drc] = dracoLoader;

    const plyLoader = new PLYLoader();
    this.loaders[SUPPORTED_MESH_TYPES.ply] = plyLoader;

    const stlLoader = new STLLoader();
    this.loaders[SUPPORTED_MESH_TYPES.stl] = stlLoader;

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    this.loaders[3] = gltfLoader;

    this.onLoad = null;
    this.onProgress = null;
    this.onError = null;
}

MeshLoader.prototype.Load = function(loader, url) {
    return new Promise((resolve, reject) => {
        var onLoad = (geometry) => resolve(geometry);
        loader.load(url, onLoad, this.onProgress, reject);        
    })
}

MeshLoader.prototype.LoadURL = async function(url, fileName) {
    var fileType = GetFileTypeFromName(fileName || url);
    var loader = this.loaders[fileType];
    if (loader) {
        try {
            let geometry = await this.Load(loader, url);
            if (geometry) {
                this.onLoad(geometry, fileName);
            }
        }
        catch (err) {
            this.onError(err);
        }
    }
    else if (this.onError) {
        this.onError("No loaders found for this file");
    }
}

MeshLoader.prototype.LoadFile = async function(file) {
    if (file) {
        try {
            let data = await ReadFileAsync(file);
            this.LoadURL(data, file.name);
        } catch(err) {
            this.onError(err);
        }
    }
}

export default MeshLoader;