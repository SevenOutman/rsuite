import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { defaultProps, prefix } from '../utils';
import { StandardProps } from '../@types/common';

export interface GridProps extends StandardProps {
  /** Sets id for controlled component   */
  controlId?: string;

  /** Fluid layout */
  fluid?: boolean;

  /** You can use a custom element for this component */
  componentClass?: React.ElementType;
}

function Grid({ fluid, componentClass: Component, className, classPrefix, ...props }: GridProps) {
  const addPrefix = prefix(classPrefix);
  const classes = classNames(fluid ? addPrefix('fluid') : classPrefix, className);
  return <Component {...props} className={classes} />;
}

Grid.propTypes = {
  className: PropTypes.string,
  fluid: PropTypes.bool,
  classPrefix: PropTypes.string,
  componentClass: PropTypes.elementType
};

export default defaultProps<GridProps>({
  componentClass: 'div',
  classPrefix: 'grid-container'
})(Grid);
