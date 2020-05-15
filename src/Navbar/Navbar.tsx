import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { prefix, defaultProps, createContext } from '../utils';
import { StandardProps } from '../@types/common';

export const NavbarContext = createContext(null);

export interface NavbarProps extends StandardProps {
  appearance?: 'default' | 'inverse' | 'subtle';
  classPrefix?: string;
  componentClass?: React.ElementType;
}

class Navbar extends React.Component<NavbarProps> {
  static propTypes = {
    classPrefix: PropTypes.string,
    className: PropTypes.string,
    appearance: PropTypes.oneOf<NavbarProps['appearance']>(['default', 'inverse', 'subtle']),
    componentClass: PropTypes.elementType,
    hasChildContext: PropTypes.bool
  };
  static defaultProps = {
    hasChildContext: true,
    appearance: 'default'
  };

  render() {
    const {
      className,
      componentClass: Component,
      hasChildContext,
      classPrefix,
      appearance,
      ...rest
    } = this.props;
    const addPrefix = prefix(classPrefix);
    const classes = classNames(classPrefix, addPrefix(appearance), className);

    return (
      <NavbarContext.Provider value={hasChildContext}>
        <Component {...rest} className={classes} role="navigation" />
      </NavbarContext.Provider>
    );
  }
}

export default defaultProps<NavbarProps>({
  componentClass: 'div',
  classPrefix: 'navbar'
})(Navbar);
