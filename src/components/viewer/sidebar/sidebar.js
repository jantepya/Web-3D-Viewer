import React from 'react';
import { Button } from 'reactstrap';
import './sidebar.css';

const SceneListItem = function (props) {
    return (
        <option className="sceneListItem" value={props.uuid} selected={props.selected}>
            {props.name}
        </option>
    )
}

export default class SideBar extends React.Component {
    constructor() {
        super()
        this.sceneList = React.createRef();
    }

    onSelectionChanged = (event) => {
        var currentSelection = [];
        for (let selection of event.target.selectedOptions) {
            if (selection) {
                currentSelection.push(selection.value);
            }
        }
        
        if (this.props.onSelectionChanged) {
            this.props.onSelectionChanged(currentSelection);
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

                <form>
                    <select multiple="multiple" ref={this.sceneList} onChange={this.onSelectionChanged}> {
                        Object.entries(this.props.sceneObjects).map(([key, value]) => {
                            return <SceneListItem key={key} uuid={key} {...value} />
                        })
                    }
                    </select>
                </form>
            </div>
        )
    }   
}