import React from 'react';
import { Button } from 'reactstrap';
import './sidebar.css';

const SceneListItem = function (props) {
    return (
        <option className="sceneListItem" value={props.uuid} onSelect={props.onSelect}>
            {props.name}
        </option>
    )
}

export default class SideBar extends React.Component {
    constructor() {
        super()
        this.sceneList = React.createRef();
        this.state = {
            sceneItems: []
        }
    }

    removeFromSceneList = (uuid) => {
        var sceneItems = [...this.state.sceneItems];
        var index = sceneItems.findIndex((item) => item.uuid === uuid)
        if (index !== -1) {
            sceneItems.splice(index, 1);
            this.setState({sceneItems: sceneItems});
            this.props.onItemRemoved(uuid);
        }
    }

    addToSceneList = (item) => {
        this.setState(prevState => ({sceneItems: [...prevState.sceneItems, item]}))
    }

    onDeleteButtonClicked = () => {
        if (this.sceneList.current && this.sceneList.current.selectedOptions) {
            for (let item of this.sceneList.current.selectedOptions) {
                this.removeFromSceneList(item.value);
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
                    <select multiple="multiple" ref={this.sceneList}> {
                        this.state.sceneItems.map(item => {
                            return <SceneListItem {...item} />
                        })
                    }
                    </select>
                </form>
            </div>
        )
    }   
}