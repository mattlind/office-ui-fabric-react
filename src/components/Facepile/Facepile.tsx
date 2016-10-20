import * as React from 'react';
import { css } from '../../utilities/css';
import { IFacepileProps, IFacepilePersona } from './Facepile.Props';
import {
  Persona,
  PERSONA_INITIALS_COLOR,
  PersonaInitialsColor,
  PersonaSize
} from '../../Persona';
import './Facepile.scss';

export class Facepile extends React.Component<IFacepileProps, {}> {
  public static defaultProps: IFacepileProps = {
    availableWidth: 0,
    addUserIconColor: PersonaInitialsColor.blue,
    overflowIconColor: PersonaInitialsColor.black,
    maxDisplayablePersonas: 5,
    personas: []
  };

  public refs: {
    [key: string]: React.ReactInstance;
    facepileMembers: HTMLElement;
  };

  private FACEPILE_PERSONA_SIZE: number = 32;

  // public componentWillReceiveProps(nextProps: IFacepileProps) {
  //   if (nextProps.availableWidth) {
  //     this.setState({
  //       maxDisplayablePersonas: nextProps.maxDisplayablePersonas
  //     });
  //   }
  // }

  public render(): JSX.Element {
    return (
      <div className='ms-Facepile'>
        <div className='ms-Facepile-members' ref='facepileMembers'>
          {this.props.showAddButton ? this._getAddNewElement() : null}
          {
            this._getDisplayablePersonas(this.props.personas).map((persona: IFacepilePersona, index: number) => {
              const personaControl: JSX.Element = this._getPersonaControl(persona);
              let personaResult: JSX.Element = persona.onClick ?
                this._getElementWithOnClickEvent(personaControl, persona, index) :
                this._getElementWithoutOnClickEvent(personaControl, persona, index);
              return personaResult;
            })
          }
        </div>
      </div>
    );
  }

  private _addNumberNotPictured(numPersonasToShow: number, hasPersonasNotPictured: boolean, numPersonasNotPictured: number, personasToShow:
    IFacepilePersona[]): void {
    if (hasPersonasNotPictured) {
      personasToShow.push({
        imageInitials: '+' + numPersonasNotPictured,
        initialsColor: PersonaInitialsColor.black,
        personaName: this.props.personas.slice(numPersonasToShow).map((persona: IFacepilePersona, index: number) => {
          return persona.personaName;
        }).join(', ')
      });
    }
  }

  private _calculateNumPersonasToShow(): number {
    let maxShownPersonas: number = this.props.availableWidth ?
        this._calculateUsingAvailableWidth() :
        this._calculateUsingMaxPersonas();

    // Remove one for the add person button
    if (this.props.showAddButton) {
      --maxShownPersonas;
    }

    // Remove one if exceeded for +1 circle
    if (this.props.personas.length > maxShownPersonas) {
      --maxShownPersonas;
    }

    return this.props.personas.length < maxShownPersonas ? this.props.personas.length : maxShownPersonas;
  }

  private _calculateUsingAvailableWidth(): number {
    let maxShownPersonas: number = Math.floor(this.props.availableWidth / this.FACEPILE_PERSONA_SIZE);
    maxShownPersonas = maxShownPersonas > this.props.maxDisplayablePersonas ? this.props.maxDisplayablePersonas : maxShownPersonas;
    return maxShownPersonas;
  }

  private _calculateUsingMaxPersonas(): number {
    return this.props.maxDisplayablePersonas;
  }

  private _getAddNewElement(): JSX.Element {
    return <button
      className={css('ms-Facepile-itemBtn', 'ms-Persona-initials', PERSONA_INITIALS_COLOR[this.props.addUserIconColor])}
      key='addFace'
      onMouseDown={this._onAddClick.bind(this)}>
      <i className='ms-Icon msIcon ms-Icon--AddFriend' aria-hidden='true'></i>
    </button>;
  }

  private _getDisplayablePersonas(personas: IFacepilePersona[]): IFacepilePersona[] {
    let numPersonasToShow: number = this._calculateNumPersonasToShow();
    let numPersonasNotPictured: number = this.props.personas.length - numPersonasToShow;
    let hasPersonasNotPictured: boolean = numPersonasNotPictured > 0;
    let personasToShow: IFacepilePersona[] = this.props.personas.slice(0, numPersonasToShow);

    this._addNumberNotPictured(numPersonasToShow, hasPersonasNotPictured, numPersonasNotPictured, personasToShow);

    return personasToShow;
  }s

  private _getPersonaControl(persona: IFacepilePersona): JSX.Element {
    let personalDetailsHidden: boolean = this.props.personas.length > 1;
    return  <Persona
              imageInitials={ persona.imageInitials }
              imageUrl={ persona.imageUrl }
              initialsColor={ persona.initialsColor }
              primaryText={ persona.personaName }
              size={ PersonaSize.extraSmall }
              hidePersonaDetails={ personalDetailsHidden } />;
  }

  private _getElementWithOnClickEvent(personaControl: JSX.Element, persona: IFacepilePersona, index: number): JSX.Element {
    return  <button
              className='ms-Facepile-itemBtn ms-Facepile-itemBtn--member'
              title={ persona.personaName }
              key={ index }
              onClick={ this._onPersonaClick.bind(this, persona) }
              onMouseMove={ this._onPersonaMouseMove.bind(this, persona) }
              onMouseOut={ this._onPersonaMouseOut.bind(this, persona) }>
              { personaControl }
            </button>;
  }

  private _getElementWithoutOnClickEvent(personaControl: JSX.Element, persona: IFacepilePersona, index: number): JSX.Element {
    return  <div
              className='ms-Facepile-itemBtn ms-Facepile-itemBtn--member'
              title={ persona.personaName }
              key={ index }
              onMouseMove={ this._onPersonaMouseMove.bind(this, persona) }
              onMouseOut={ this._onPersonaMouseOut.bind(this, persona) }>
              { personaControl }
            </div>;
  }

  private _onAddClick(ev?: React.MouseEvent): void {
    this.props.onClickAddButton();
    ev.preventDefault();
    ev.stopPropagation();
  }

  private _onPersonaClick(persona: IFacepilePersona, ev?: React.MouseEvent): void {
    persona.onClick(ev, persona);
    ev.preventDefault();
    ev.stopPropagation();
  }

  private _onPersonaMouseMove(persona: IFacepilePersona, ev?: React.MouseEvent): void {
    if (!!persona.onMouseMove) {
      persona.onMouseMove(ev, persona);
    }
  }

  private _onPersonaMouseOut(persona: IFacepilePersona, ev?: React.MouseEvent): void {
    if (!!persona.onMouseOut) {
      persona.onMouseOut(ev, persona);
    }
  }
}
