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

export interface IFacepileState {
  maxDisplayablePersonas: number;
}

export class Facepile extends React.Component<IFacepileProps, IFacepileState> {
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

  private lastPersonaRefKey: string;
  private FACEPILE_PERSONA_SIZE: number = 32;

  public constructor(props: IFacepileProps) {
    super(props);

    this.state = {
      maxDisplayablePersonas: props.maxDisplayablePersonas
    };
  }

  public componentDidMount() {
    this._rerenderDownToSize();
  }

  public componentDidUpdate() {
    this._rerenderDownToSize();
  }

  public componentWillReceiveProps(nextProps: IFacepileProps) {
    if (nextProps.availableWidth) {
      this.setState({
        maxDisplayablePersonas: nextProps.maxDisplayablePersonas
      });
    }
  }

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
              this.lastPersonaRefKey = 'Persona' + index;
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
    let maxShownPersonas: number;

    if (this.state.maxDisplayablePersonas !== this.props.maxDisplayablePersonas) {
      maxShownPersonas = this.state.maxDisplayablePersonas;
    } else {
      maxShownPersonas = this.props.availableWidth ?
        this._calculateUsingAvailableWidth() :
        this._calculateUsingMaxPersonas();
    }

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

  private _calculateUsedWidth(): number {
    let offsetLeft: number = (this.refs[this.lastPersonaRefKey] as HTMLElement).offsetLeft;
    let offsetWidth: number = (this.refs[this.lastPersonaRefKey] as HTMLElement).offsetWidth;
    return offsetLeft + offsetWidth;
  }

  private _calculateUsingAvailableWidth(): number {
    let maxShownPersonas: number = Math.floor(this.props.availableWidth / this.FACEPILE_PERSONA_SIZE);
    maxShownPersonas = maxShownPersonas > this.state.maxDisplayablePersonas ? this.state.maxDisplayablePersonas : maxShownPersonas;
    return maxShownPersonas;
  }

  private _calculateUsingMaxPersonas(): number {
    return this.state.maxDisplayablePersonas;
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
  }

  private _getPersonaControl(persona: IFacepilePersona): JSX.Element {
    let personalDetailsHidden: boolean = this.props.personas.length > 1;
    return <Persona
      imageInitials={persona.imageInitials}
      imageUrl={persona.imageUrl}
      initialsColor={persona.initialsColor}
      primaryText={persona.personaName}
      size={PersonaSize.extraSmall}
      hidePersonaDetails={personalDetailsHidden} />;
  }

  private _getElementWithOnClickEvent(personaControl: JSX.Element, persona: IFacepilePersona, index: number): JSX.Element {
    return <button
      className='ms-Facepile-itemBtn ms-Facepile-itemBtn--member'
      title={persona.personaName}
      key={index}
      ref={'Persona' + index}
      onClick={this._onPersonaClick.bind(this, persona)}
      onMouseMove={this._onPersonaMouseMove.bind(this, persona)}
      onMouseOut={this._onPersonaMouseOut.bind(this, persona)}>
      {personaControl}
    </button>;
  }

  private _getElementWithoutOnClickEvent(personaControl: JSX.Element, persona: IFacepilePersona, index: number): JSX.Element {
    return (
      <div key={index}>
        <div
          className='ms-Facepile-itemBtn ms-Facepile-itemBtn--member'
          title={persona.personaName}
          ref={'Persona' + index}
          onMouseMove={this._onPersonaMouseMove.bind(this, persona)}
          onMouseOut={this._onPersonaMouseOut.bind(this, persona)}>
          {personaControl}
        </div>
        {this.props.showData && persona.data ? (
          <div className='ms-Facepile-itemBtn ms-Persona-secondaryText'>[{persona.data}]</div>
        ) : (null)}
      </div>
    );
  }

  private _rerenderDownToSize(): void {
    if (!this.props.availableWidth) { return; }
    // Grab all personas and calculate width usage
    let usedWidth: number = this._calculateUsedWidth();
    let maxPersonasAvailable: number = this.props.personas.length;

    if (usedWidth > this.props.availableWidth) {
      if (this.state.maxDisplayablePersonas > 1) {
        if (maxPersonasAvailable < this.state.maxDisplayablePersonas) {
          this.setState({
            maxDisplayablePersonas: maxPersonasAvailable - 1
          });
        } else {
          this.setState({
            maxDisplayablePersonas: this.state.maxDisplayablePersonas - 1
          });
        }
      }
    }
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
