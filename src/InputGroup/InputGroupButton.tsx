import * as React from 'react';

import classNames from 'classnames';
import { defaultProps } from '../utils';
import Button, { ButtonProps } from '../Button';

function InputGroupButton({ className, classPrefix, ...props }: ButtonProps) {
  return <Button componentClass="a" {...props} className={classNames(classPrefix, className)} />;
}

export default defaultProps<ButtonProps>({
  classPrefix: 'input-group-btn'
})(InputGroupButton);
