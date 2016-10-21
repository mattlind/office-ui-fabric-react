import * as React from 'react';
import { Facepile } from './Facepile';
import { PersonaInitialsColor, PersonaSize } from '../Persona/index';

export interface IFacepileProps extends React.Props<Facepile> {
  /**
   * Array of IPersonaProps that define each Persona. Note that the size
   * is fixed at PersonaSize.extraSmall regardless of what is specified.
   */
  personas: IFacepilePersona[];

  /** Maximum number of personas to show */
  maxDisplayablePersonas?: number;

  /** Maximum widthavailable to display in */
  availableWidth?: number;

  /** Size to display the persona controls at */
  personaSize?: PersonaSize;

  /** Show add person button */
  showAddButton?: boolean;

  /** Background color to display the add user icon */
  addUserIconColor?: PersonaInitialsColor;

  /** Background color of the overflow icon */
  overflowIconColor?: PersonaInitialsColor;

  onClickAddButton?: (ev?: React.MouseEvent) => void;
}

export interface IFacepilePersona {
  /**
   * Name of the person.
   */
  personaName?: string;

  /**
   * Url to the image to use, should be a square aspect ratio and big enough to fit in the image area.
   */
  imageUrl?: string;

  /**
   * The user's initials to display in the image area when there is no image.
   */
  imageInitials?: string;

  /**
   * The background color when the user's initials are displayed.
   * @defaultvalue PersonaInitialsColor.blue
   */
  initialsColor?: PersonaInitialsColor;

  /**
   * If provided, persona will be rendered with cursor:pointer and the handler will be
   * called on click.
   */
  onClick?: (ev?: React.MouseEvent, persona?: IFacepilePersona) => void;

  /**
   * If provided, the handler will be called on mouse move.
   */
  onMouseMove?: (ev?: React.MouseEvent, persona?: IFacepilePersona) => void;

  /**
   * If provided, the handler will be called when mouse moves out of the component.
   */
  onMouseOut?: (ev?: React.MouseEvent, persona?: IFacepilePersona) => void;

  /**
   * Extra data - not used directly but can be handy for passing additional data to custom event
   * handlers.
   */
  data?: any;
}
