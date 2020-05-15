import * as React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { defaultProps, prefix } from '../utils';
import { StandardProps } from '../@types/common';

export interface DividerProps extends StandardProps {
  /** Primary content */
  children?: React.ReactNode;

  /** Vertical dividing line */
  vertical?: boolean;

  /** You can use a custom element for this component */
  componentClass?: React.ElementType;
}

function Divider({
  vertical,
  componentClass: Component,
  className,
  children,
  classPrefix,
  ...props
}: DividerProps) {
  const addPrefix = prefix(classPrefix);
  const classes = classNames(classPrefix, className, {
    [addPrefix('vertical')]: vertical,
    [addPrefix('horizontal')]: !vertical,
    [addPrefix('with-text')]: !!children
  });

  return (
    <Component {...props} className={classes}>
      {children ? <span className={addPrefix('inner-text')}>{children}</span> : null}
    </Component>
  );
}

Divider.propTypes = {
  className: PropTypes.string,
  vertical: PropTypes.bool,
  classPrefix: PropTypes.string,
  children: PropTypes.node,
  componentClass: PropTypes.elementType
};

export default defaultProps<DividerProps>({
  componentClass: 'div',
  classPrefix: 'divider'
})(Divider);
