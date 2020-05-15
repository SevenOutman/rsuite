import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Transition from '../Animation/Transition';
import shallowEqual from '../utils/shallowEqual';
import _ from 'lodash';
import { prefix, defaultProps, getUnhandledProps, createContext } from '../utils';
import { StandardProps } from '../@types/common';

export const SidenavContext = createContext(null);

export interface SidenavProps<T = any> extends StandardProps {
  /** Whether to expand the Sidenav */
  expanded?: boolean;

  /** Menu style */
  appearance?: 'default' | 'inverse' | 'subtle';

  /** Open menu, corresponding to Dropdown eventkey */
  defaultOpenKeys?: T[];

  /** Open menu, corresponding to Dropdown eventkey (controlled) */
  openKeys?: T[];

  /** Activation option, corresponding menu eventkey */
  activeKey?: T;

  /** You can use a custom element type for this component */
  componentClass?: React.ElementType;

  /** Menu opening callback function that changed */
  onOpenChange?: (openKeys: T[], event: React.SyntheticEvent<any>) => void;

  /** Select the callback function for the menu */
  onSelect?: (eventKey: T, event: React.SyntheticEvent<any>) => void;
}

interface SidenavState {
  openKeys?: any[];
}

class Sidenav extends React.Component<SidenavProps, SidenavState> {
  static propTypes = {
    classPrefix: PropTypes.string,
    className: PropTypes.string,
    expanded: PropTypes.bool,
    appearance: PropTypes.oneOf(['default', 'inverse', 'subtle']),
    defaultOpenKeys: PropTypes.array,
    openKeys: PropTypes.array,
    onOpenChange: PropTypes.func,
    activeKey: PropTypes.any,
    onSelect: PropTypes.func,
    componentClass: PropTypes.elementType
  };
  static defaultProps = {
    appearance: 'default',
    expanded: true
  };

  constructor(props) {
    super(props);
    this.state = {
      openKeys: props.defaultOpenKeys || []
    };
  }

  getOpenKeys = () => {
    const { openKeys } = this.props;

    if (_.isUndefined(openKeys)) {
      return this.state.openKeys;
    }

    return openKeys;
  };

  handleSelect = (eventKey: any, event: React.MouseEvent) => {
    this.props.onSelect?.(eventKey, event);
  };

  handleOpenChange = (eventKey: any, event: React.MouseEvent) => {
    const find = key => shallowEqual(key, eventKey);
    const openKeys = _.clone(this.getOpenKeys()) || [];

    if (openKeys.some(find)) {
      _.remove(openKeys, find);
    } else {
      openKeys.push(eventKey);
    }

    this.setState({ openKeys });
    this.props.onOpenChange?.(openKeys, event);
  };

  render() {
    const {
      className,
      classPrefix,
      appearance,
      expanded,
      activeKey,
      componentClass: Component,
      ...props
    } = this.props;

    const addPrefix = prefix(classPrefix);
    const classes = classNames(classPrefix, addPrefix(appearance), className);
    const unhandled = getUnhandledProps(Sidenav, props);

    return (
      <SidenavContext.Provider
        value={{
          expanded,
          activeKey,
          sidenav: true,
          openKeys: this.getOpenKeys(),
          onOpenChange: this.handleOpenChange,
          onSelect: this.handleSelect
        }}
      >
        <Transition
          in={expanded}
          timeout={300}
          exitedClassName={addPrefix('collapse-out')}
          exitingClassName={addPrefix(['collapse-out', 'collapsing'])}
          enteredClassName={addPrefix('collapse-in')}
          enteringClassName={addPrefix(['collapse-in', 'collapsing'])}
        >
          {(props, ref) => {
            const { className, ...rest } = props;
            return (
              <Component
                {...rest}
                {...unhandled}
                ref={ref}
                className={classNames(classes, className)}
                role="navigation"
              />
            );
          }}
        </Transition>
      </SidenavContext.Provider>
    );
  }
}

export default defaultProps<SidenavProps>({
  classPrefix: 'sidenav',
  componentClass: 'div'
})(Sidenav);
