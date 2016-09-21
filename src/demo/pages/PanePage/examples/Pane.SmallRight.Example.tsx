import * as React from 'react';
import {
  Pane,
  PaneType,
  Button
} from '../../../../index';

export class PaneSmallRightExample extends React.Component<any, any> {

  constructor() {
    super();
    this.state = {
      showPane: false
    };
  }

  // First one is content, second is pane content - TODO: make this design better
  // Can I use htmlFor or refs to point the control to the content it should attach to?
  public render() {
    return (
      <div>
        <Button description='Opens the Sample Pane' onClick={ this._showPane.bind(this) }>Open Pane</Button>
        <Pane
          isOpen={ this.state.showPane }
          type={ PaneType.smallFixedFar }
          onDismiss= { this._closePane.bind(this) }
          headerText='Pane - Small, right-aligned, fixed'
          >
          <span className='ms-font-m'>Main content goes here.</span>
          <span className='ms-font-m'>Pane content goes here.</span>
        </Pane>
      </div>
    );
  }

  private _showPane() {
    this.setState({ showPane: true });
  }
  private _closePane() {
    this.setState({ showPane: false });
  }
}
