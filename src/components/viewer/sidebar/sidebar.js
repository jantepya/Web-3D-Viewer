import React from 'react';
import { Button } from 'reactstrap';
import './sidebar.css';
import { SUPPORTED_MESH_TYPES } from '../../../config.js';

const SceneListItem = function (props) {
    return (
        <option className="sceneListItem" value={props.uuid}>
            {props.name}
        </option>
    )
}

export default class SideBar extends React.Component {
    constructor() {
        super()
        this.sceneList = React.createRef();
        this.state = {
            sceneObjects: []
        }
    }

    removeObjectsFromScene = (uuidsToRemove) => {
        var sceneObjects = [...this.state.sceneObjects];

        for (let uuid of uuidsToRemove) {
            var index = sceneObjects.findIndex((object) => object.uuid === uuid)
            if (index !== -1) {
                sceneObjects.splice(index, 1);
            }
        }

        this.setState({sceneObjects: sceneObjects});

        if (this.props.onItemsRemoved) {
            this.props.onItemsRemoved(uuidsToRemove);
        }
    }

    addToSceneList = (item) => {
        this.setState(prevState => ({sceneObjects: [...prevState.sceneObjects, item]}))
    }

    onSelectionChanged = (event) => {
        if (this.props.onSelectionChanged) {
            this.props.onSelectionChanged(event);
        }
    }

    onDeleteButtonClicked = () => {
        if (this.sceneList.current && this.sceneList.current.selectedOptions) {
            var objectsToRemove = [];
            for (let object of this.sceneList.current.selectedOptions) {
                objectsToRemove.push(object.value);
            }

            this.removeObjectsFromScene(objectsToRemove);
        }
    }

    onUploadButtonClicked = () => {
        var input = document.createElement('input');
        input.type = 'file';
        input.onchange = this.props.onFileSelected;
        input.click();
    }

    render = function () {
        return (
            <div className="sidebar">
                <Button color="primary" onClick={this.onUploadButtonClicked}>+</Button>
                <Button color="danger" onClick={this.onDeleteButtonClicked}>-</Button>

                <form>
                    <select multiple="multiple" ref={this.sceneList} onChange={this.onSelectionChanged}> {
                        this.state.sceneObjects.map(object => {
                            return <SceneListItem key={object.uuid} {...object} />
                        })
                    }
                    </select>
                </form>
            </div>
        )
    }   
}