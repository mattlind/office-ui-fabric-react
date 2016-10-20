import * as React from 'react';
import {
  Dropdown,
  IDropdownOption,
  IFacepileProps,
  Facepile
} from '../../../../index';
import { facepilePersonas } from './FacepileExampleData';

const facepileProps: IFacepileProps = {
  personas: facepilePersonas
};

export interface IFacepileExtraDataExampleState {
  showData: any;
}

export class FacepileExtraDataExample extends React.Component<any, IFacepileExtraDataExampleState> {
  public constructor() {
    super();

    this.state = {
      showData: 1
    };
  }

  public render() {
    let { showData } = this.state;
    facepileProps.showData = showData;

    return (
      <div>
        <Facepile {...facepileProps} />
          <Dropdown
          label='Show extra data:'
          options={
            [
              { key: 1, text: 'Yes' },
              { key: 0, text: 'No' }
            ]
          }
          selectedKey={this.state.showData}
          onChanged={this._onDropdownChanged.bind(this)}
          />
      </div>
    );
  }

  private _onDropdownChanged(option: IDropdownOption) {
    this.setState({
      showData: option.key
    });
  }
}