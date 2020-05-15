import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { defaultProps, prefix } from '../utils';
import { StandardProps } from '../@types/common';

export interface InputGroupAddonProps extends StandardProps {
  /** An Input group addon can show that it is disabled */
  disabled?: boolean;
}

function InputGroupAddon({ className, classPrefix, disabled, ...props }: InputGroupAddonProps) {
  const addPrefix = prefix(classPrefix);
  const classes = classNames(classPrefix, className, {
    [addPrefix('disabled')]: disabled
  });

  return <span {...props} className={classes} />;
}

InputGroupAddon.propTypes = {
  className: PropTypes.string,
  classPrefix: PropTypes.string,
  disabled: PropTypes.bool
};

export default defaultProps<InputGroupAddonProps>({
  classPrefix: 'input-group-addon'
})(InputGroupAddon);
