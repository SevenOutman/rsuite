import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import shallowEqual from '../utils/shallowEqual';

import {
  prefix,
  getUnhandledProps,
  getClassNamePrefix,
  defaultProps,
  ReactChildren
} from '../utils';
import { NavbarContext } from '../Navbar';
import { SidenavContext } from '../Sidenav/Sidenav';
import { StandardProps } from '../@types/common';

export interface NavProps<T = any> extends StandardProps {
  /** Primary content */
  children?: React.ReactNode;

  /** sets appearance */
  appearance?: 'default' | 'subtle' | 'tabs';

  /** Reverse Direction of tabs/subtle */
  reversed?: boolean;

  /** Justified navigation */
  justified?: boolean;

  /** Vertical navigation */
  vertical?: boolean;

  /** appears on the right. */
  pullRight?: boolean;

  /** Active key, corresponding to eventkey in <Nav.item>. */
  activeKey?: T;

  /** Callback function triggered after selection */
  onSelect?: (eventKey: T, event: React.SyntheticEvent<any>) => void;
}

class Nav extends React.Component<NavProps> {
  static contextType = SidenavContext;
  static propTypes = {
    classPrefix: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
    appearance: PropTypes.oneOf(['default', 'subtle', 'tabs']),
    // Reverse Direction of tabs/subtle
    reversed: PropTypes.bool,
    justified: PropTypes.bool,
    vertical: PropTypes.bool,
    pullRight: PropTypes.bool,
    activeKey: PropTypes.any,
    onSelect: PropTypes.func
  };
  static defaultProps = {
    appearance: 'default'
  };

  render() {
    const {
      classPrefix,
      appearance,
      vertical,
      justified,
      reversed,
      pullRight,
      className,
      children,
      ...props
    } = this.props;

    const {
      sidenav = false,
      expanded = false,
      activeKey = props.activeKey,
      onSelect = props.onSelect
    } = this.context || {};

    const addPrefix = prefix(classPrefix);
    const globalClassNamePrefix = getClassNamePrefix();

    const hasWaterline = appearance !== 'default';

    const items = ReactChildren.mapCloneElement(children, item => {
      const { eventKey, active, ...rest } = item.props;
      const displayName = item?.type?.displayName;

      if (~displayName?.indexOf('(NavItem)')) {
        return {
          ...rest,
          onSelect,
          hasTooltip: sidenav && !expanded,
          active: typeof activeKey === 'undefined' ? active : shallowEqual(activeKey, eventKey)
        };
      }
      if (~displayName?.indexOf('(Dropdown)')) {
        return {
          ...rest,
          onSelect,
          activeKey,
          componentClass: 'li'
        };
      }

      return null;
    });

    const unhandled = getUnhandledProps(Nav, props);

    return (
      <NavbarContext.Consumer>
        {navbar => {
          const classes = classNames(classPrefix, addPrefix(appearance), className, {
            [`${globalClassNamePrefix}navbar-nav`]: navbar,
            [`${globalClassNamePrefix}navbar-right`]: pullRight,
            [`${globalClassNamePrefix}sidenav-nav`]: sidenav,
            [addPrefix('horizontal')]: navbar || (!vertical && !sidenav),
            [addPrefix('vertical')]: vertical || sidenav,
            [addPrefix('justified')]: justified,
            [addPrefix('reversed')]: reversed
          });
          return (
            <div {...unhandled} className={classes}>
              <ul>{items}</ul>
              {hasWaterline && <div className={addPrefix('waterline')} />}
            </div>
          );
        }}
      </NavbarContext.Consumer>
    );
  }
}

export default defaultProps<NavProps>({
  classPrefix: 'nav'
})(Nav);
