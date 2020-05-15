import * as React from 'react';
import PropTypes from 'prop-types';
import { defaultProps, getUnhandledProps, prefix } from '../utils';
import classNames from 'classnames';
import { StandardProps } from '../@types/common';

export interface PlaceholderGraphProps extends StandardProps {
  /* height of rows */
  height?: number;

  /* width of rows */
  width?: number;

  /** Placeholder status */
  active?: boolean;
}

function PlaceholderGraph({ className, width, height, style, active, classPrefix, ...rest }: PlaceholderGraphProps) {
  const addPrefix = prefix(classPrefix);
  const unhandled = getUnhandledProps(PlaceholderGraph.propTypes, rest);
  const classes = classNames(classPrefix, addPrefix('graph'), className, {
    [addPrefix('active')]: active
  });
  return (
    <div
      className={classes}
      style={{
        width: width || '100%',
        height,
        ...style
      }}
      {...unhandled}
    />
  );
}

PlaceholderGraph.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  classPrefix: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  active: PropTypes.bool
};

PlaceholderGraph.defaultProps = {
  height: 200
};

export default defaultProps<PlaceholderGraphProps>({
  classPrefix: 'placeholder'
})(PlaceholderGraph);
