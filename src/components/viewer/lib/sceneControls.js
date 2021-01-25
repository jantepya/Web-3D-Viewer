import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

export default class SceneControls extends TrackballControls {
    constructor(camera, domElement) {
        super(camera, domElement);
     
        this.rotateSpeed = 1.5;
        this.zoomSpeed = 2;
        this.staticMoving = true;
    }
}
