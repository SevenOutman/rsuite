import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import SafeAnchor from '../SafeAnchor';
import Ripple from '../Ripple';
import { prefix, defaultProps, getUnhandledProps, createChainedFunction } from '../utils';

import { StandardProps } from '../@types/common';

export interface PaginationButtonProps extends StandardProps {
  /** The value of the current option */
  eventKey?: any;

  /** Called when the button is clicked. */
  onClick?: React.MouseEventHandler;

  /** A button can show it is currently unable to be interacted with */
  disabled?: boolean;

  /** A button can show it is currently the active user selection */
  active?: boolean;

  /** You can use a custom element for this component */
  componentClass: React.ElementType;

  /** Primary content */
  children?: React.ReactNode;

  /** Select the callback function for the current option  */
  onSelect?: (eventKey: any, event: React.MouseEvent) => void;

  /** Custom rendering item */
  renderItem?: (item: React.ReactNode) => React.ReactNode;
}

class PaginationButton extends React.Component<PaginationButtonProps> {
  static propTypes = {
    classPrefix: PropTypes.string,
    eventKey: PropTypes.any,
    onSelect: PropTypes.func,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    active: PropTypes.bool,
    className: PropTypes.string,
    componentClass: PropTypes.elementType,
    children: PropTypes.node,
    style: PropTypes.object,
    renderItem: PropTypes.func
  };
  handleClick = (event: React.MouseEvent) => {
    const { disabled, onSelect, eventKey } = this.props;
    if (disabled) {
      return;
    }

    onSelect?.(eventKey, event);
  };

  render() {
    const {
      active,
      disabled,
      onClick,
      className,
      classPrefix,
      style,
      componentClass: Component,
      children,
      renderItem,
      ...rest
    } = this.props;

    const addPrefix = prefix(classPrefix);
    const unhandled = getUnhandledProps(PaginationButton, rest);
    const classes = classNames(classPrefix, className, {
      [addPrefix('active')]: active,
      [addPrefix('disabled')]: disabled
    });

    const itemProps = {
      ...unhandled,
      disabled,
      onClick: createChainedFunction(onClick, this.handleClick)
    };

    if (Component !== SafeAnchor && typeof Component !== 'string') {
      itemProps.active = active;
    }

    const item = (
      <Component {...itemProps}>
        {children}
        <Ripple />
      </Component>
    );

    return (
      <li className={classes} style={style}>
        {renderItem ? renderItem(item) : item}
      </li>
    );
  }
}

export default defaultProps<PaginationButtonProps>({
  classPrefix: 'pagination-btn',
  componentClass: SafeAnchor
})(PaginationButton);
