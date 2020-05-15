import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { defaultProps } from '../utils';
import { FormGroupContext } from '../FormGroup';
import { StandardProps } from '../@types/common';

export interface ControlLabelProps extends StandardProps {
  /** Primary content */
  children?: React.ReactNode;

  /** Attribute of the html label tag, defaults to the controlId of the FormGroup */
  htmlFor?: string;

  /** Screen reader only */
  srOnly?: boolean;
}

function ControlLabel({ srOnly, htmlFor, className, classPrefix, ...rest }: ControlLabelProps) {
  const classes = classNames(classPrefix, className, {
    'sr-only': srOnly
  });

  return (
    <FormGroupContext.Consumer>
      {controlId => <label {...rest} htmlFor={htmlFor || controlId} className={classes} />}
    </FormGroupContext.Consumer>
  );
}

ControlLabel.propTypes = {
  className: PropTypes.string,
  htmlFor: PropTypes.string,
  classPrefix: PropTypes.string,
  srOnly: PropTypes.bool
};

export default defaultProps<ControlLabelProps>({
  classPrefix: 'control-label'
})(ControlLabel);
