import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import SafeAnchor from '../SafeAnchor';
import Tooltip from '../Tooltip';
import Whisper from '../Whisper';
import Ripple from '../Ripple';
import { IconProps } from '../Icon';

import { createChainedFunction, defaultProps, prefix, getUnhandledProps } from '../utils';
import { StandardProps } from '../@types/common';

const addTooltip = (children, tip) => (
  <Whisper speaker={<Tooltip>{tip}</Tooltip>} placement="right">
    {children}
  </Whisper>
);

export interface NavItemProps<T = any> extends StandardProps {
  /** Activation status */
  active?: boolean;

  /** Disabled status */
  disabled?: boolean;

  /** divier for nav item */
  divider?: boolean;

  /** display panel */
  panel?: boolean;

  /** Sets the icon for the component */
  icon?: React.ReactElement<IconProps>;

  /** Primary content */
  children?: React.ReactNode;

  /** The value of the current option */
  eventKey?: T;

  /** Whether NavItem have a tooltip  */
  hasTooltip?: boolean;

  /** You can use a custom element type for this component */
  componentClass?: React.ElementType;

  /** Select the callback function that the event triggers. */
  onSelect?: (eventKey: T, event: React.SyntheticEvent<any>) => void;

  /** Custom rendering item */
  renderItem?: (item: React.ReactNode) => React.ReactNode;
}

class NavItem extends React.Component<NavItemProps> {
  static displayName = 'NavItem';
  static propTypes = {
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    classPrefix: PropTypes.string,
    divider: PropTypes.bool,
    panel: PropTypes.bool,
    onClick: PropTypes.func,
    style: PropTypes.object,
    icon: PropTypes.node,
    onSelect: PropTypes.func,
    children: PropTypes.node,
    eventKey: PropTypes.any,
    tabIndex: PropTypes.number,
    hasTooltip: PropTypes.bool,
    componentClass: PropTypes.elementType,
    renderItem: PropTypes.func
  };
  static defaultProps = {
    tabIndex: 0
  };

  handleClick = (event: React.MouseEvent) => {
    const { onSelect, disabled, eventKey } = this.props;
    if (onSelect && !disabled) {
      onSelect(eventKey, event);
    }
  };

  render() {
    const {
      active,
      disabled,
      onClick,
      className,
      classPrefix,
      style,
      children,
      icon,
      tabIndex,
      hasTooltip,
      divider,
      panel,
      componentClass: Component,
      renderItem,
      ...rest
    } = this.props;

    const addPrefix = prefix(classPrefix);
    const unhandled = getUnhandledProps(NavItem, rest);
    const classes = classNames(classPrefix, className, {
      [addPrefix('active')]: active,
      [addPrefix('disabled')]: disabled
    });

    if (divider) {
      return (
        <li
          role="separator"
          style={style}
          className={classNames(addPrefix('divider'), className)}
        />
      );
    }

    if (panel) {
      return (
        <li style={style} className={classNames(addPrefix('panel'), className)}>
          {children}
        </li>
      );
    }

    if (Component === SafeAnchor) {
      unhandled.disabled = disabled;
    }

    let item: React.ReactNode = (
      <Component
        {...unhandled}
        role="button"
        tabIndex={tabIndex}
        className={addPrefix('content')}
        onClick={createChainedFunction(onClick, this.handleClick)}
      >
        {icon}
        {children}
        <Ripple />
      </Component>
    );

    if (renderItem) {
      item = renderItem(item);
    }

    return (
      <li className={classes} style={style}>
        {hasTooltip ? addTooltip(item, children) : item}
      </li>
    );
  }
}

export default defaultProps<NavItemProps>({
  classPrefix: 'nav-item',
  componentClass: SafeAnchor
})(NavItem);
