/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/unbound-method */
import React from 'react';
import Helmet from 'react-helmet';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { createSelector } from 'reselect';
import { User } from '../../redux/prop-types';
import { userSelector } from '../../redux/selectors';
import { FlashMessageArg } from '../../redux/types';
import Flash from '../Flash';
import {
  FlashActionTypes,
  flashMessageSelector,
  ReducerBase,
  removeFlashMessage
} from '../Flash/redux';
import UniversalNav from './components/universal-nav';

import './header.css';

const mapStateToProps = createSelector(
  flashMessageSelector,
  userSelector,
  flashMessage => ({
    flashMessage,
    hasMessage: !!flashMessage.message
  })
);
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      removeFlashMessage
    },
    dispatch
  );
interface HeaderProps {
  fetchState: { pending: boolean };
  user: User;
  flashMessage: { id: string } & FlashMessageArg;
  hasMessage: boolean;
  removeFlashMessage: () => ReducerBase<FlashActionTypes.RemoveFlashMessage>;
}
type StateProps = ReturnType<typeof mapStateToProps> & HeaderProps;

export class Header extends React.Component<
  StateProps,
  { displayMenu: boolean; isLanguageMenuDisplayed: boolean }
> {
  menuButtonRef: React.RefObject<HTMLButtonElement>;
  searchBarRef: React.RefObject<any>;
  static displayName: string;
  constructor(props: HeaderProps) {
    super(props);
    this.state = {
      displayMenu: false,
      isLanguageMenuDisplayed: false
    };
    this.menuButtonRef = React.createRef();
    this.searchBarRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.hideMenu = this.hideMenu.bind(this);
    this.showLanguageMenu = this.showLanguageMenu.bind(this);
    this.hideLanguageMenu = this.hideLanguageMenu.bind(this);
  }

  handleClickOutside(event: globalThis.MouseEvent): void {
    const eventTarget = event.target as HTMLElement;
    if (
      this.state.displayMenu &&
      this.menuButtonRef.current &&
      !this.menuButtonRef.current.contains(eventTarget) &&
      // since the search bar is part of the menu on small screens, clicks on
      // the search bar should not toggle the menu
      this.searchBarRef.current &&
      !this.searchBarRef.current.contains(eventTarget) &&
      // don't count clicks on searcn bar inputs reset button
      !eventTarget.closest('.ais-SearchBox-reset') &&
      // don't count clicks on language button/menu
      !eventTarget.closest('.nav-lang') &&
      // don't count clicks on disabled elements
      !eventTarget.closest('[aria-disabled="true"]')
    ) {
      this.hideMenu();
    }
  }

  showMenu(): void {
    this.setState({ displayMenu: true }, () => {
      document.addEventListener('click', this.handleClickOutside);
    });
  }

  hideMenu(): void {
    this.setState({ displayMenu: false }, () => {
      document.removeEventListener('click', this.handleClickOutside);
      this.hideLanguageMenu();
    });
  }

  // elementToFocus must be a link in the language menu
  showLanguageMenu(elementToFocus: HTMLButtonElement): void {
    this.setState({ isLanguageMenuDisplayed: true }, () =>
      elementToFocus.focus()
    );
  }

  hideLanguageMenu(): void {
    this.setState({ isLanguageMenuDisplayed: false });
  }

  render(): JSX.Element {
    const { displayMenu, isLanguageMenuDisplayed } = this.state;
    const { fetchState, user, hasMessage, flashMessage, removeFlashMessage } =
      this.props;
    return (
      <>
        <Helmet>
          <style>
            {
              ':root{--header-height: 38px; --search-box-form: 38px; --lang-menu-height: 22.5rem;}'
            }
          </style>
        </Helmet>
        <header>
          <a href='#content-start' className='skip-to-content-button'>
            Skip To Content
          </a>
          <UniversalNav
            displayMenu={displayMenu}
            fetchState={fetchState}
            isLanguageMenuDisplayed={isLanguageMenuDisplayed}
            hideLanguageMenu={this.hideLanguageMenu}
            hideMenu={this.hideMenu}
            menuButtonRef={this.menuButtonRef}
            searchBarRef={this.searchBarRef}
            showMenu={this.showMenu}
            showLanguageMenu={this.showLanguageMenu}
            user={user}
          />
        </header>
        {hasMessage && flashMessage ? (
          <Flash
            flashMessage={flashMessage}
            removeFlashMessage={removeFlashMessage}
          />
        ) : null}
      </>
    );
  }
}

Header.displayName = 'Header';

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(Header));
