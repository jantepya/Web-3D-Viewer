import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

const GetFileTypeFromName = function(filename) {
    return filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
}

const MeshLoader = function() {
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderConfig( {type:"wasm"} )
    this.dracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/versioned/decoders/1.4.1/' );
    this.dracoLoader.preload();

    this.plyLoader = new PLYLoader();
    this.stlLoader = new STLLoader();

    this.onLoad = null;
    this.onProgress = null;
    this.onError = null;
}

MeshLoader.prototype.LoadURL = function(url, fileName) {
    var loader = null;

    var fileType = GetFileTypeFromName(fileName);

    if (fileType === "drc") {
        loader = this.dracoLoader;
    }
    else if (fileType === "ply") {
        loader = this.plyLoader;
    }
    else if (fileType === "stl") {
        loader = this.stlLoader;
    }

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