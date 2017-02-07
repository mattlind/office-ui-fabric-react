import * as React from 'react';
import {
  BaseComponent,
  buttonProperties,
  css,
  divProperties,
  getNativeProps
} from '../../Utilities';
import {
  IFacepileProps,
  IFacepilePersona,
  OverflowButtonType
} from './Facepile.Props';
import {
  FocusZone,
  FocusZoneDirection
} from '../FocusZone';
import {
  Persona,
  PersonaSize
} from '../Persona';
import {
  PERSONA_SIZE
} from '../Persona/PersonaConsts';
import './Facepile.scss';

export class Facepile extends BaseComponent<IFacepileProps, any> {
  public static defaultProps: IFacepileProps = {
    useOnlyAvailableWidth: false,
    maxDisplayablePersonas: 5,
    personas: [],
    personaSize: PersonaSize.extraSmall
  };

  private _members: HTMLElement;

  public componentWillMount() {
    // Re-render when mounting to get a true count based on actual size the mounted persona will take up.
    this.forceUpdate();
  }

public render(): JSX.Element {
    let { chevronButtonProps, overflowButtonProps, overflowButtonType, personas, showAddButton } = this.props;
    let numPersonasToShow: number = this._calculateDisplayablePersonas();

    // Added for deprecating chevronButtonProps.  Can remove after v1.0
    if (chevronButtonProps && !overflowButtonProps) {
      overflowButtonProps = chevronButtonProps;
      overflowButtonType = OverflowButtonType.downArrow;
    }

    return (
      <div className='ms-Facepile'>
        <div
          className='ms-Facepile-members'
          ref={ this._resolveRef('_members') }
          >
          { showAddButton ? this._getAddNewElement() : null }
          <FocusZone direction={ FocusZoneDirection.horizontal }>
            {
              numPersonasToShow ? (
                personas.slice(0, numPersonasToShow).map((persona: IFacepilePersona, index: number) => {
                  const personaControl: JSX.Element = this._getPersonaControl(persona);
                  return persona.onClick ?
                    this._getElementWithOnClickEvent(personaControl, persona, index) :
                    this._getElementWithoutOnClickEvent(personaControl, persona, index);
                })) : null
            }
            { overflowButtonType !== OverflowButtonType.none ? this._getOverflowElement(numPersonasToShow) : null }
          </FocusZone>
        </div>
        <div className='ms-Facepile-clear'></div>
      </div>
    );
  }

  private _calculateDisplayablePersonas(): number {
    let maxPersonasToShow: number =
      this.props.useOnlyAvailableWidth ?
        this._calculatePersonasBasedOnWidthAvailable() :
        this._calculatePersonasBasedOnMaxAllowed();

    return Math.max(Math.min(maxPersonasToShow - this._calculateExtraSpaceNeeds(maxPersonasToShow), this.props.personas.length), 0);
  }

  private _calculateExtraSpaceNeeds(maxPersonasToShow: number): number {
    let extraSpace: number = 0;
    if (this.props.showAddButton) { extraSpace++; }
    if (this.props.overflowButtonType === OverflowButtonType.more ||
      this.props.overflowButtonType === OverflowButtonType.downArrow ||
      this._willDisplayDescriptiveOverflowButton(this.props.overflowButtonType, maxPersonasToShow)) { extraSpace++; }
    return extraSpace;
  }

  private _willDisplayDescriptiveOverflowButton(overflowButtonType: OverflowButtonType, numPersonasToShow: number): boolean {
    if (overflowButtonType !== OverflowButtonType.descriptive) { return false; }
    let numPersonasNotPictured: number = this.props.personas.length - numPersonasToShow;
    return numPersonasNotPictured > 0;
  }

  private _calculatePersonasBasedOnMaxAllowed(): number {
    let numPersonasToShow: number = this.props.maxDisplayablePersonas;
    return Math.max(numPersonasToShow, 1);
  }

  private _calculatePersonasBasedOnWidthAvailable(): number {
    let numPersonasToShow: number = this.props.maxDisplayablePersonas;

    if (this._members) {
      let calculatedMax: number = 1;
      let nodes: NodeListOf<Element> = this._members.querySelectorAll('.ms-Facepile-itemButton');

      if (nodes) {
        let boundingBoxWidth: number = this._members.getBoundingClientRect().width;
        let tempNode: Node;

        if (nodes.length === 1) {
          // Add a temp node to find actual node width
          tempNode = nodes[0].cloneNode();
          nodes[0].parentNode.appendChild(tempNode);
          nodes = this._members.querySelectorAll('.ms-Facepile-itemButton');
        }

        if (nodes && nodes.length > 1) {
          // Check that the second element doesn't wrap
          if (nodes[0].getBoundingClientRect().bottom === nodes[1].getBoundingClientRect().bottom) {
            // Get the distance between left edges
            let elementWidth: number = Math.abs(nodes[1].getBoundingClientRect().left - nodes[0].getBoundingClientRect().left);
            calculatedMax = Math.floor(boundingBoxWidth / elementWidth);
          }
        }

        // If we used a temp node remove it
        if (tempNode) {
          nodes[0].parentNode.removeChild(tempNode);
        }
      }

      numPersonasToShow = calculatedMax;
    }

    numPersonasToShow = Math.min(this.props.maxDisplayablePersonas, numPersonasToShow);
    return Math.max(numPersonasToShow, 1);
  }

  private _getPersonaControl(persona: IFacepilePersona): JSX.Element {
    let { getPersonaProps, personaSize } = this.props;
    return <Persona
      imageInitials={ persona.imageInitials }
      imageUrl={ persona.imageUrl }
      initialsColor={ persona.initialsColor }
      primaryText={ persona.personaName }
      size={ personaSize }
      hidePersonaDetails={ true }
      {...(getPersonaProps ? getPersonaProps(persona) : null) }
      />;
  }

  private _getElementWithOnClickEvent(personaControl: JSX.Element, persona: IFacepilePersona, index: number): JSX.Element {
    return <button
      { ...getNativeProps(persona, buttonProperties) }
      className='ms-Facepile-itemButton'
      title={ persona.personaName }
      key={ (!!persona.imageUrl ? 'i' : '') + index }
      onClick={ this._onPersonaClick.bind(this, persona) }
      onMouseMove={ this._onPersonaMouseMove.bind(this, persona) }
      onMouseOut={ this._onPersonaMouseOut.bind(this, persona) }>
      { personaControl }
    </button>;
  }

  private _getElementWithoutOnClickEvent(personaControl: JSX.Element, persona: IFacepilePersona, index: number): JSX.Element {
    return <div
      { ...getNativeProps(persona, divProperties) }
      className='ms-Facepile-itemButton'
      title={ persona.personaName }
      key={ (!!persona.imageUrl ? 'i' : '') + index }
      onMouseMove={ this._onPersonaMouseMove.bind(this, persona) }
      onMouseOut={ this._onPersonaMouseOut.bind(this, persona) }>
      { personaControl }
    </div>;
  }

  private _getOverflowElement(numPersonasToShow: number): JSX.Element {
    switch (this.props.overflowButtonType) {
      case OverflowButtonType.descriptive:
        return this._getDescriptiveOverflowElement(numPersonasToShow);
      case OverflowButtonType.downArrow:
        return this._getIconElement('ChevronDown');
      case OverflowButtonType.more:
        return this._getIconElement('More');
      default:
        return null;
    }
  }

  private _getDescriptiveOverflowElement(numPersonasToShow: number): JSX.Element {
    let { personaSize } = this.props;
    let numPersonasNotPictured: number = this.props.personas.length - numPersonasToShow;

    if (numPersonasNotPictured < 1) { return null; }

    let personaNames: string = this.props.personas.slice(numPersonasToShow).map((p: IFacepilePersona) => p.personaName).join(', ');

    return <button { ...getNativeProps(this.props.overflowButtonProps, buttonProperties) }
      className={ css('ms-Persona', PERSONA_SIZE[personaSize], 'ms-Facepile-descriptiveOverflowButton', 'ms-Facepile-itemButton') }
      title={ personaNames }>
      { '+' + numPersonasNotPictured }
    </button>;
  }

  private _getIconElement(icon: string): JSX.Element {
    let { personaSize } = this.props;
    return <button { ...getNativeProps(this.props.overflowButtonProps, buttonProperties) }
      className={ css('ms-Persona', PERSONA_SIZE[personaSize], 'ms-Facepile-overflowButton', 'ms-Facepile-itemButton') }>
      <i className={ css('ms-Icon', 'msIcon', `ms-Icon ms-Icon--${icon}`) } aria-hidden='true'></i>
    </button>;
  }

  private _getAddNewElement(): JSX.Element {
    let { personaSize } = this.props;
    return <button { ...getNativeProps(this.props.addButtonProps, buttonProperties) }
      className={ css('ms-Persona', PERSONA_SIZE[personaSize], 'ms-Facepile-addButton', 'ms-Facepile-itemButton') }>
      <i className='ms-Icon msIcon ms-Icon--AddFriend' aria-hidden='true'></i>
    </button>;
  }

  private _onPersonaClick(persona: IFacepilePersona, ev?: React.MouseEvent<HTMLElement>): void {
    persona.onClick(ev, persona);
    ev.preventDefault();
    ev.stopPropagation();
  }

  private _onPersonaMouseMove(persona: IFacepilePersona, ev?: React.MouseEvent<HTMLElement>): void {
    if (!!persona.onMouseMove) {
      persona.onMouseMove(ev, persona);
    }
  }

  private _onPersonaMouseOut(persona: IFacepilePersona, ev?: React.MouseEvent<HTMLElement>): void {
    if (!!persona.onMouseOut) {
      persona.onMouseOut(ev, persona);
    }
  }
}