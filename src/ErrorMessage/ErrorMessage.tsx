import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import { defaultProps, prefix, placementPolyfill } from '../utils';
import { PLACEMENT_8 } from '../constants';
import { StandardProps, TypeAttributes } from '../@types/common';

export interface ErrorMessageProps extends StandardProps {
  /** Primary content */
  children?: React.ReactNode;

  /** Show error messages */
  show?: boolean;

  /** The placement of error messages */
  placement?: TypeAttributes.Placement8;
}

function ErrorMessage({
  className,
  show,
  classPrefix,
  children,
  placement,
  ...props
}: ErrorMessageProps) {
  if (!show) {
    return null;
  }

  const addPrefix = prefix(classPrefix);
  const wrapClasses = classNames(addPrefix('wrapper'), className, {
    [addPrefix(`placement-${_.kebabCase(placementPolyfill(placement))}`)]: placement
  });
  const classes = classNames(classPrefix, addPrefix('show'));

  return (
    <div {...props} className={wrapClasses}>
      <span className={classes}>
        <span className={addPrefix('arrow')} />
        <span className={addPrefix('inner')}>{children}</span>
      </span>
    </div>
  );
}

ErrorMessage.propTypes = {
  show: PropTypes.bool,
  classPrefix: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  placement: PropTypes.oneOf<TypeAttributes.Placement8>(PLACEMENT_8)
};

export default defaultProps<ErrorMessageProps>({
  classPrefix: 'error-message'
})(ErrorMessage);
