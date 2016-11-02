/* tslint:disable:no-unused-variable */
import * as React from 'react';
/* tslint:enable:no-unused-variable */

import { BaseComponent } from '../../common/BaseComponent';
import { Popup } from '../Popup/index';
import { css } from '../../utilities/css';
import { getId } from '../../utilities/object';
import { getRTL } from '../../utilities/rtl';
import { IPaneProps, PaneType } from './Pane.Props';
import { PaneContent } from './PaneContent';
import { WrappedContent } from './WrappedContent';
import './Pane.scss';

export interface IPaneState {
  isOpen?: boolean;
  isAnimatingOpen?: boolean;
  isAnimatingClose?: boolean;
  id?: string;
}

export class Pane extends BaseComponent<IPaneProps, IPaneState> {

  public static defaultProps: IPaneProps = {
    isOpen: false,
    hasCloseButton: true,
    type: PaneType.smallFixedFar
  };

  private _initialContentWidth: number;
  private _contentContainer = 'content-container';
  private _mainContent = 'main-content';

  constructor(props: IPaneProps) {
    super(props);

    this._onClose = this._onClose.bind(this);
    this._onPaneRef = this._onPaneRef.bind(this);

    this.state = {
      isOpen: !!props.isOpen,
      isAnimatingOpen: props.isOpen,
      isAnimatingClose: false,
      id: getId('Pane')
    };
  }

  public componentDidMount() {
    if (this.props.isOverlay) {
      // Set original content width for overlay mode
      this._initialContentWidth = (this.refs[this._contentContainer] as HTMLElement).clientWidth;
    }

    if (this.state.isOpen) {
      this._async.setTimeout(() => {
        this.setState({
          isAnimatingOpen: false
        });
      }, 2000);
    }
  }

  public componentWillReceiveProps(newProps: IPaneProps) {
    if (newProps.isOpen !== this.state.isOpen) {
      this.setState({
        isOpen: newProps.isOpen,
        isAnimatingOpen: newProps.isOpen ? true : false,
        isAnimatingClose: newProps.isOpen ? false : true
      });
    }
  }

  public componentDidUpdate() {
    if (this.props.isOverlay) {
      // Use original content width for overlay mode
      (this.refs[this._contentContainer] as HTMLElement).style.width = this._initialContentWidth + 'px';
    } else {
      // Viewport content width for push mode
      (this.refs[this._contentContainer] as HTMLElement).style.width = this._getContainerWidth() + 'px';
    }
  }

  public render() {
    let { className = '', type, hasCloseButton, headerText, closeButtonAriaLabel, headerClassName = ''  } = this.props;
    let { isOpen, isAnimatingOpen, isAnimatingClose, id } = this.state;
    let isLeft = type === PaneType.smallFixedNear ? true : false;
    let isRTL = getRTL();
    let isOnRightSide = isRTL ? isLeft : !isLeft;
    const headerTextId = id + '-headerText';
    let pendingCommandBarContent = '';

    let header;
    if (headerText) {
      header = <p className={ css('ms-Pane-headerText', headerClassName) } id={ headerTextId }>{ headerText }</p>;
    }

    let closeButton;
    if (hasCloseButton) {
      closeButton = <button className='ms-Pane-closeButton ms-PaneAction-close' onClick={ this._onClose }  aria-label={ closeButtonAriaLabel } data-is-visible={ true }>
        <i className='ms-Pane-closeIcon ms-Icon ms-Icon--Cancel'></i>
      </button>;
    }

    let groupings = this._groupChildren();

    return (
      <div className={
        css('ms-Pane', {
          'ms-Pane--left': !isOnRightSide,
          'ms-Pane--right': isOnRightSide
        })
      }
        >
        <div
          className={ this._mainContent }
          ref={ this._mainContent }
          >
          <div
            className={ this._contentContainer }
            ref={ this._contentContainer }
            >
            { groupings.wrappedContents }
          </div>
        </div>
        <Popup
          className='popup'
          role='dialog'
          ariaLabelledBy={ headerText ? headerTextId : undefined }
          onDismiss={ this.props.onDismiss }>
          <div
            ref={ this._onPaneRef }
            className={
              css('ms-Pane', className, {
                'ms-Pane--openLeft': !isOnRightSide,  // because the RTL animations are not being used, we need to set a class
                'ms-Pane--openRight': isOnRightSide,  // because the RTL animations are not being used, we need to set a class
                'is-open': isOpen,
                'ms-Pane-animateIn': isAnimatingOpen,
                'ms-Pane-animateOut': isAnimatingClose,
                'ms-Pane--smFluid': type === PaneType.smallFluid,
                'ms-Pane--smLeft': type === PaneType.smallFixedNear,
                'ms-Pane--sm': type === PaneType.smallFixedFar,
                'ms-Pane--md': type === PaneType.medium,
                'ms-Pane--lg': type === PaneType.large || type === PaneType.largeFixed,
                'ms-Pane--fixed': type === PaneType.largeFixed,
                'ms-Pane--xl': type === PaneType.extraLarge
              })
            }
            >
            <div className='ms-Pane-main'>
              <div className='ms-Pane-commands' data-is-visible={ true } >
                { pendingCommandBarContent }
                { closeButton }
              </div>
              <div className='ms-Pane-contentInner'>
                { header }
                <div className='ms-Pane-content'>
                  { groupings.paneContents }
                </div>
              </div>
            </div>
          </div>
        </Popup>
      </div>
    );
  }

  public dismiss() {
    if (this.state.isOpen) {
      this.setState({
        isAnimatingOpen: false,
        isAnimatingClose: true
      });
    }
  }

  private _getContainerWidth(): number {
    return (this.refs[this._mainContent] as HTMLElement).clientWidth;
  }

  private _groupChildren(): { wrappedContents: any[]; paneContents: any[]; } {

    let groupings: { wrappedContents: any[]; paneContents: any[]; } = {
      wrappedContents: [],
      paneContents: []
    };

    React.Children.map(this.props.children, child => {
      if (typeof child === 'object' && child.type === PaneContent) {
        groupings.paneContents.push(child);
      } else if (typeof child === 'object' && child.type === WrappedContent) {
        groupings.wrappedContents.push(child);
      }
    });

    return groupings;
  }

  private _onAnimationEnd(ev: AnimationEvent) {
    if (ev.animationName.indexOf('In') > -1) {
      this.setState({
        isOpen: true,
        isAnimatingOpen: false
      });
    }
    if (ev.animationName.indexOf('Out') > -1) {
      this.setState({
        isOpen: false,
        isAnimatingClose: false
      });

      if (this.props.onDismiss) {
        this.props.onDismiss();
      }
    }
  }

  private _onClose() {
    this.dismiss();
  }

  private _onPaneRef(ref: HTMLDivElement) {
    if (ref) {
      this._events.on(ref, 'animationend', this._onAnimationEnd);
    } else {
      this._events.off();
    }
  }
}