import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { defaultProps, prefix } from '../utils';
import { StandardProps } from '../@types/common';

export type FlexboxGridItemProps<P = {}> = StandardProps & {
  /** spacing between grids */
  colspan?: number;

  /** grid orders for sorting */
  order?: number;

  /** You can use a custom element for this component */
  componentClass?: React.ElementType<P>;
} & P;

function FlexboxGridItem({
  className,
  classPrefix,
  colspan = 0,
  order = 0,
  componentClass: Component = 'div',
  ...props
}: FlexboxGridItemProps) {
  const addPrefix = prefix(classPrefix);
  const classes = classNames(className, classPrefix, {
    [addPrefix(`${colspan}`)]: colspan >= 0,
    [addPrefix(`order-${order}`)]: order
  });

  return <Component {...props} className={classes} />;
}

FlexboxGridItem.propTypes = {
  className: PropTypes.string,
  colspan: PropTypes.number,
  order: PropTypes.number,
  classPrefix: PropTypes.string,
  componentClass: PropTypes.elementType
};

export default defaultProps<FlexboxGridItemProps>({
  classPrefix: 'flex-box-grid-item'
})(FlexboxGridItem);
