import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

const SupportedFileTypes = {
    "drc": 0, 
    "ply": 1, 
    "stl": 2
};

const GetFileTypeFromName = function(filename) {
    var type = filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
    return SupportedFileTypes[type];
}

const MeshLoader = function() {
    this.loaders = {};

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderConfig( {type:"wasm"} )
    dracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/versioned/decoders/1.4.1/' );
    dracoLoader.preload();
    this.loaders[SupportedFileTypes.drc] = dracoLoader;

    const plyLoader = new PLYLoader();
    this.loaders[SupportedFileTypes.ply] = plyLoader;

    const stlLoader = new STLLoader();
    this.loaders[SupportedFileTypes.stl] = stlLoader;

    this.onLoad = null;
    this.onProgress = null;
    this.onError = null;
}

MeshLoader.prototype.LoadURL = function(url, fileName) {
    var fileType = GetFileTypeFromName(fileName);
    var loader = this.loaders[fileType];
    if (loader) {
        var onLoad = (geometry) => {
            if (this.onLoad) {
                this.onLoad(geometry, fileName);
            }
        }

        loader.load(url, onLoad, this.onProgress, this.onError);
    }
    else if (this.onError) {
        this.onError();
    }
}

MeshLoader.prototype.LoadFile = function(file) {
    if (file) {
        var reader = new FileReader();
        reader.onload = () => this.LoadURL(reader.result, file.name);
        reader.readAsDataURL(file);
    }
}

export default MeshLoader;