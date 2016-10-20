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

export interface IFacepileOverflowExampleState {
  maxDisplayablePersonas: any;
  availableWidth: any;
}

export class FacepileOverflowExample extends React.Component<any, IFacepileOverflowExampleState> {
  public constructor() {
    super();

    this.state = {
      maxDisplayablePersonas: 5,
      availableWidth: 200
    };
  }

  public render() {
    let { maxDisplayablePersonas, availableWidth } = this.state;
    facepileProps.maxDisplayablePersonas = maxDisplayablePersonas;
    facepileProps.availableWidth = availableWidth;

    return (
      <div>
        <Facepile {...facepileProps} />
        <Dropdown
          label='Max Personas Allowed:'
          options={
            [
              { key: 1, text: '1' },
              { key: 2, text: '2' },
              { key: 3, text: '3' },
              { key: 4, text: '4' },
              { key: 5, text: '5' },
              { key: 6, text: '6' },
              { key: 7, text: '7' },
              { key: 8, text: '8' },
              { key: 9, text: '9' },
              { key: 10, text: '10' },
              { key: 11, text: '11' },
              { key: 12, text: '12' },
              { key: 13, text: '13' },
              { key: 14, text: '14' },
              { key: 15, text: '15' },
              { key: 16, text: '16' },
              { key: 17, text: '17' },
              { key: 18, text: '18' },
              { key: 19, text: '19' },
              { key: 20, text: '20' },
              { key: 21, text: '21' },
              { key: 22, text: '22' },
              { key: 23, text: '23' },
              { key: 24, text: '24' }
            ]
          }
          selectedKey={this.state.maxDisplayablePersonas}
          onChanged={this._onDropdownChanged.bind(this)}
          />
        <Dropdown
          label='Max Width Allowed:'
          options={
            [
              { key: 40, text: '40' },
              { key: 80, text: '80' },
              { key: 120, text: '120' },
              { key: 160, text: '160' },
              { key: 200, text: '200' },
              { key: 240, text: '240' },
              { key: 280, text: '280' },
              { key: 320, text: '320' }
            ]
          }
          selectedKey={this.state.availableWidth}
          onChanged={this._onDropdownChanged2.bind(this)}
          />
      </div>
    );
  }

  private _onDropdownChanged(option: IDropdownOption) {
    this.setState((prevState: IFacepileOverflowExampleState) => {
      prevState.maxDisplayablePersonas = option.key;
      return prevState;
    });
  }

  private _onDropdownChanged2(option: IDropdownOption) {
    this.setState((prevState: IFacepileOverflowExampleState) => {
      prevState.availableWidth = option.key;
      return prevState;
    });
  }
}