import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { defaultProps, prefix } from '../utils';
import { StandardProps } from '../@types/common';

export interface FlexboxGridProps extends StandardProps {
  /** align */
  align?: 'top' | 'middle' | 'bottom';

  /** horizontal arrangement */
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
}

function FlexboxGrid({
  className,
  classPrefix,
  align = 'top',
  justify = 'start',
  ...props
}: FlexboxGridProps) {
  const addPrefix = prefix(classPrefix);
  const classes = classNames(classPrefix, className, addPrefix(align), addPrefix(justify));
  return <div {...props} className={classes} />;
}

FlexboxGrid.propTypes = {
  className: PropTypes.string,
  classPrefix: PropTypes.string,
  align: PropTypes.oneOf<FlexboxGridProps['align']>(['top', 'middle', 'bottom']),
  justify: PropTypes.oneOf<FlexboxGridProps['justify']>([
    'start',
    'end',
    'center',
    'space-around',
    'space-between'
  ])
};

const EnhancedFlexboxGrid = defaultProps<FlexboxGridProps>({
  classPrefix: 'flex-box-grid'
})(FlexboxGrid);

export default EnhancedFlexboxGrid;
