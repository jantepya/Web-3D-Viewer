import React from 'react';
import { Button } from 'reactstrap';
import './sidebar.css';
import './sceneList.css';

const SceneListItem = function (props) {
    return (
        <li className={"sceneListItem " + (props.selected ? "selected" : "")} value={props.uuid}>
            <div>
                <label>
                    <input 
                        type="checkbox" 
                        className="visibiltyCheckbox" 
                        id={"v" + props.uuid} value={props.uuid} 
                        defaultChecked={props.visible}
                        onChange={props.onVisibleChanged}
                    />
                </label>
            </div>
            <div>
                <span>{props.name}</span>
                <label className="selectionLabel">
                    <input 
                        type="checkbox"
                        className="selectionCheckbox" 
                        value={props.uuid} 
                        defaultChecked={props.selected}
                        onChange={props.onSelectionChanged}
                    />
                </label>
            </div>
        </li>
    )
}

export default class SideBar extends React.Component {
    constructor() {
        super()
        this.sceneList = React.createRef();
    }

    onSelectionChanged = (event) => {
        if (this.props.onSelectionChanged) {
            this.props.onSelectionChanged([event.target.value]);
        }
    }

    onVisibleChanged = (event) => {
        if (this.props.onVisibilityToggled) {
            this.props.onVisibilityToggled([event.target.value], event.target.checked);
        }
    }

    onDeleteButtonClicked = () => {
        if (this.sceneList.current && this.sceneList.current.selectedOptions) {
            var objectsToRemove = [];
            for (let object of this.sceneList.current.selectedOptions) {
                objectsToRemove.push(object.value);
            }

            if (this.props.onItemsRemoved) {
                this.props.onItemsRemoved(objectsToRemove);
            }    
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

                <ul ref={this.sceneList} className="sceneList"> {
                    Object.entries(this.props.sceneObjects).map(([key, value]) => {
                        return <SceneListItem 
                        key={key} 
                        uuid={key} 
                        onSelectionChanged={this.onSelectionChanged}
                        onVisibleChanged={this.onVisibleChanged}
                        {...value} />
                    })
                }
                </ul>
            </div>
        )
    }   
}