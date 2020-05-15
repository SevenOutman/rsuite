import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import shallowEqual from '../utils/shallowEqual';
import Input from '../Input';
import AutoCompleteItem from './AutoCompleteItem';
import { defaultProps, getUnhandledProps, prefix } from '../utils';
import { PickerToggleTrigger, onMenuKeyDown, MenuWrapper } from '../Picker';
import { ItemDataType, StandardProps, TypeAttributes } from '../@types/common';
import { PLACEMENT } from '../constants';

export interface AutoCompleteProps extends StandardProps {
  /** The data of component */
  data?: any[];

  /** Primary content */
  children?: React.ReactNode;

  /** Whether disabled select */
  disabled?: boolean;

  /** Initial value */
  defaultValue?: string;

  /** Current value of the input. Creates a controlled component */
  value?: string;

  /** Additional classes for menu */
  menuClassName?: string;

  /** The placement of component */
  placement?: TypeAttributes.Placement;

  /** When set to false, the Enter key selection function is invalid */
  selectOnEnter?: boolean;

  /** Called when a option is selected */
  onSelect?: (item: ItemDataType, event: React.SyntheticEvent<HTMLElement>) => void;

  /** Called when select an option or input value change, or value of input is changed */
  onChange?: (value: string, event: React.SyntheticEvent) => void;

  /** Called on focus */
  onFocus?: (event: React.SyntheticEvent<HTMLElement>) => void;

  /** Called on blur */
  onBlur?: (event: React.SyntheticEvent<HTMLElement>) => void;

  /** Called on menu focus */
  onMenuFocus?: (focusItemValue: any, event: React.SyntheticEvent<HTMLElement>) => void;

  /** Called on open */
  onOpen?: () => void;

  /** Called on close */
  onClose?: () => void;

  /** Called on hide  */
  onHide?: () => void;

  /** Custom selected option */
  renderItem?: (itemData: ItemDataType) => React.ReactNode;
}

interface State {
  value: string;
  focus?: boolean;
  focusItemValue?: string;
}

class AutoComplete extends React.Component<AutoCompleteProps, State> {
  static propTypes = {
    data: PropTypes.array,
    disabled: PropTypes.bool,
    onSelect: PropTypes.func,
    onChange: PropTypes.func,
    classPrefix: PropTypes.string,
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    className: PropTypes.string,
    menuClassName: PropTypes.string,
    placement: PropTypes.oneOf(PLACEMENT),
    onFocus: PropTypes.func,
    onMenuFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyDown: PropTypes.func,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    onHide: PropTypes.func,
    renderItem: PropTypes.func,
    style: PropTypes.object,
    open: PropTypes.bool,
    selectOnEnter: PropTypes.bool,
    onEnter: PropTypes.func,
    onEntering: PropTypes.func,
    onEntered: PropTypes.func,
    onExit: PropTypes.func,
    onExiting: PropTypes.func,
    onExited: PropTypes.func
  };
  static defaultProps = {
    data: [],
    placement: 'bottomStart',
    selectOnEnter: true
  };
  menuContainerRef: React.RefObject<any>;
  triggerRef: React.RefObject<any>;

  constructor(props: AutoCompleteProps) {
    super(props);
    const { defaultValue } = props;

    this.state = {
      value: defaultValue || '',
      focus: false,
      focusItemValue: defaultValue
    };
    this.menuContainerRef = React.createRef();
    this.triggerRef = React.createRef();
  }

  getValue() {
    const { value } = this.props;
    return _.isUndefined(value) ? this.state.value : value;
  }

  getData(props?: AutoCompleteProps) {
    const { data } = props || this.props;
    if (!data) {
      return [];
    }
    return data.map(item => {
      if (typeof item === 'string') {
        return {
          value: item,
          label: item
        };
      }

      if (typeof item === 'object') {
        return item;
      }
    });
  }

  getFocusableMenuItems = () => {
    const data = this.getData();
    if (!data) {
      return [];
    }
    return data.filter(this.shouldDisplay);
  };

  findNode(focus: Function) {
    const items = this.getFocusableMenuItems();
    const { focusItemValue } = this.state;

    for (let i = 0; i < items.length; i += 1) {
      if (shallowEqual(focusItemValue, items[i].value)) {
        focus(items, i);
        return;
      }
    }

    focus(items, -1);
  }

  shouldDisplay = (item: any) => {
    const value = this.getValue();
    if (!_.trim(value)) {
      return false;
    }
    const keyword = (value || '').toLocaleLowerCase();
    return item.label.toLocaleLowerCase().indexOf(keyword) >= 0;
  };

  handleChange = (value: string, event: React.FormEvent<HTMLInputElement>) => {
    const nextState = {
      focus: true,
      focusItemValue: '',
      value
    };
    this.setState(nextState);
    this.handleChangeValue(value, event);
  };

  handleInputFocus = (event: React.SyntheticEvent<HTMLElement>) => {
    this.open();
    this.props.onFocus?.(event);
  };

  handleInputBlur = (event: React.SyntheticEvent<HTMLElement>) => {
    setTimeout(this.close, 300);
    this.props.onBlur?.(event);
  };

  focusNextMenuItem = (event: React.SyntheticEvent<HTMLElement>) => {
    this.findNode((items: any[], index: number) => {
      const item = items[index + 1];
      if (!_.isUndefined(item)) {
        const focusItemValue = item.value;
        this.setState({ focusItemValue });
        this.props.onMenuFocus?.(focusItemValue, event);
      }
    });
  };

  focusPrevMenuItem = (event: React.SyntheticEvent<HTMLElement>) => {
    this.findNode((items: any[], index: number) => {
      const item = items[index - 1];
      if (!_.isUndefined(item)) {
        const focusItemValue = item.value;
        this.setState({ focusItemValue });
        this.props.onMenuFocus?.(focusItemValue, event);
      }
    });
  };

  selectFocusMenuItem = (event: React.SyntheticEvent<HTMLElement>) => {
    const { focusItemValue, value: prevValue } = this.state;
    if (!focusItemValue) {
      return;
    }
    const nextState = {
      value: focusItemValue,
      focusItemValue
    };

    const data = this.getData();
    const focusItem: any = data.find(item => item?.value === focusItemValue);

    this.setState(nextState);
    this.handleSelect(focusItem, event);
    if (prevValue !== focusItemValue) {
      this.handleChangeValue(focusItemValue, event);
    }

    this.close();
  };

  close = () => {
    this.setState({ focus: false }, this.props.onClose);
  };
  open = () => {
    this.setState({ focus: true }, this.props.onOpen);
  };

  handleKeyDown = (event: React.KeyboardEvent) => {
    if (!this.menuContainerRef.current) {
      return;
    }

    const { onKeyDown, selectOnEnter } = this.props;

    onMenuKeyDown(event, {
      down: this.focusNextMenuItem,
      up: this.focusPrevMenuItem,
      enter: selectOnEnter ? this.selectFocusMenuItem : undefined,
      esc: this.close
    });

    onKeyDown?.(event);
  };

  handleChangeValue = (value: any, event: React.SyntheticEvent<HTMLElement>) => {
    const { onChange } = this.props;
    onChange?.(value, event);
  };

  handleSelect = (item: ItemDataType, event: React.SyntheticEvent<HTMLElement>) => {
    this.props.onSelect?.(item, event);
  };

  handleItemSelect = (item: ItemDataType, event: React.SyntheticEvent<HTMLElement>) => {
    const value = item.value;
    const prevValue = this.state.value;
    const nextState = {
      value,
      focusItemValue: value
    };
    this.setState(nextState);
    this.handleSelect(item, event);
    if (prevValue !== value) {
      this.handleChangeValue(value, event);
    }
    this.close();
  };

  addPrefix = (name: string) => prefix(this.props.classPrefix)(name);

  renderDropdownMenu() {
    const { renderItem, menuClassName } = this.props;
    const data = this.getData();
    const { focusItemValue } = this.state;
    const classes = classNames(this.addPrefix('menu'), menuClassName);
    const items: ItemDataType[] = data.filter(this.shouldDisplay);

    return (
      <MenuWrapper className={classes} onKeyDown={this.handleKeyDown} ref={this.menuContainerRef}>
        <ul role="menu">
          {items.map((item: ItemDataType) => (
            <AutoCompleteItem
              key={item.value}
              focus={focusItemValue === item.value}
              itemData={item}
              onSelect={this.handleItemSelect}
              renderItem={renderItem}
            >
              {item.label}
            </AutoCompleteItem>
          ))}
        </ul>
      </MenuWrapper>
    );
  }
  render() {
    const { disabled, className, classPrefix, open, style, ...rest } = this.props;

    const data = this.getData();
    const value = this.getValue();
    const unhandled = getUnhandledProps(AutoComplete, rest);
    const classes = classNames(classPrefix, className, {
      [this.addPrefix('disabled')]: disabled
    });

    const hasItems = data.filter(this.shouldDisplay).length > 0;

    return (
      <div className={classes} style={style}>
        <PickerToggleTrigger
          pickerProps={this.props}
          ref={this.triggerRef}
          trigger={['click', 'focus']}
          open={open || (this.state.focus && hasItems)}
          speaker={this.renderDropdownMenu()}
        >
          <Input
            {...unhandled}
            disabled={disabled}
            value={value}
            onBlur={this.handleInputBlur}
            onFocus={this.handleInputFocus}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
          />
        </PickerToggleTrigger>
      </div>
    );
  }
}

export default defaultProps<AutoCompleteProps>({
  classPrefix: 'auto-complete'
})(AutoComplete);
