import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import { RadioContext, RadioContextProps } from '../RadioGroup';

import { prefix, getUnhandledProps, partitionHTMLProps, defaultProps, refType } from '../utils';
import { StandardProps } from '../@types/common';

export interface RadioProps<V = any> extends StandardProps {
  /** HTML title */
  title?: string;

  /** The disable of component */
  disabled?: boolean;

  /** Specifies whether the radio is selected */
  checked?: boolean;

  /** Specifies the initial state: whether or not the radio is selected */
  defaultChecked?: boolean;

  /** Ref for the input element */
  inputRef?: React.Ref<any>;

  /** Value, corresponding to the value of the Radiogroup, to determine whether the */
  value?: V;

  /** Name to use for form */
  name?: string;

  /** Inline layout */
  inline?: boolean;

  /** Primary content */
  children?: React.ReactNode;

  /** Callback function with value changed */
  onChange?: (value: V, checked: boolean, event: React.SyntheticEvent<HTMLInputElement>) => void;
}

interface RadioState {
  checked?: boolean;
}

class Radio extends React.Component<RadioProps, RadioState> {
  static contextType = RadioContext;
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    inline: PropTypes.bool,
    title: PropTypes.string,
    disabled: PropTypes.bool,
    checked: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    inputRef: refType,
    children: PropTypes.node,
    className: PropTypes.string,
    classPrefix: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    tabIndex: PropTypes.number
  };
  static defaultProps = {
    tabIndex: 0
  };
  context: RadioContextProps = {};

  constructor(props) {
    super(props);
    this.state = {
      checked: props.defaultChecked
    };
  }

  getCheckedByValue() {
    const { value } = this.props;
    if (!_.isUndefined(this.context.value)) {
      return this.context.value === value;
    }
    return this.props.checked;
  }

  updateCheckedState(checked: boolean, callback?: () => void) {
    this.setState({ checked }, callback);
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, disabled, onChange } = this.props;
    const checked = true;
    if (disabled) {
      return;
    }

    this.setState({ checked });
    this.context.onChange?.(value, checked, event);
    onChange?.(value, checked, event);
  };

  render() {
    const {
      title,
      className,
      children,
      disabled,
      defaultChecked,
      classPrefix,
      tabIndex,
      inputRef,
      onClick,
      ...props
    } = this.props;

    const { inline = this.props.inline, name = this.props.name } = this.context;
    const checked = this.getCheckedByValue();
    const addPrefix = prefix(classPrefix);
    const classes = classNames(classPrefix, className, {
      [addPrefix('inline')]: inline,
      [addPrefix('disabled')]: disabled,
      [addPrefix('checked')]: _.isUndefined(checked) ? this.state.checked : checked
    });

    const unhandled = getUnhandledProps(Radio, props);
    const [htmlInputProps, rest] = partitionHTMLProps(unhandled);

    const input = (
      <span className={addPrefix('wrapper')} aria-disabled={disabled}>
        <input
          {...htmlInputProps}
          type="radio"
          checked={checked}
          defaultChecked={defaultChecked}
          ref={inputRef}
          name={name}
          tabIndex={tabIndex}
          disabled={disabled}
          onChange={this.handleChange}
          onClick={event => event.stopPropagation()}
        />
        <span className={addPrefix('inner')} aria-hidden={true} role="presentation" />
      </span>
    );

    return (
      <div {...rest} onClick={onClick} className={classes}>
        <div className={addPrefix('checker')}>
          <label title={title}>
            {input}
            {children}
          </label>
        </div>
      </div>
    );
  }
}

export default defaultProps<RadioProps>({
  classPrefix: 'radio'
})(Radio);
