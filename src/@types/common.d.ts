import React from 'react';
import { ListProps } from 'react-virtualized/dist/commonjs/List';

export interface StandardProps {
  /** The prefix of the component CSS class */
  classPrefix?: string;

  /** Additional classes */
  className?: string;

  /** Additional style */
  style?: React.CSSProperties;

  [key: string]: any;
}

export interface AnimationEventProps {
  /** Callback fired before the Modal transitions in */
  onEnter?: (node: null | Element | Text) => void;

  /** Callback fired as the Modal begins to transition in */
  onEntering?: (node: null | Element | Text) => void;

  /** Callback fired after the Modal finishes transitioning in */
  onEntered?: (node: null | Element | Text) => void;

  /** Callback fired right before the Modal transitions out */
  onExit?: (node: null | Element | Text) => void;

  /** Callback fired as the Modal begins to transition out */
  onExiting?: (node: null | Element | Text) => void;

  /** Callback fired after the Modal finishes transitioning out */
  onExited?: (node: null | Element | Text) => void;
}

export interface PickerBaseProps extends StandardProps, AnimationEventProps {
  /** locale */
  locale?: any;

  /** A picker can have different appearances. */
  appearance?: 'default' | 'subtle';

  /** Format picker to appear inside a content block */
  block?: boolean;

  /** Set the padding of the container. */
  containerPadding?: number;

  /** Sets the rendering container */
  container?: HTMLElement | (() => HTMLElement);

  /** A picker can show it is currently unable to be interacted with */
  disabled?: boolean;

  /** You can use a custom element for this component */
  toggleComponentClass?: React.ElementType;

  /** A CSS class to apply to the Menu DOM node. */
  menuClassName?: string;

  /** A style to apply to the Menu DOM node. */
  menuStyle?: object;

  /** Placeholder text */
  placeholder?: React.ReactNode;

  /** The placement of picker */
  placement?: TypeAttributes.Placement;

  /** Prevent floating element overflow */
  preventOverflow?: boolean;

  /** Open the menu and control it */
  open?: boolean;

  /** Initial open menu */
  defaultOpen?: boolean;

  /** A picker that can clear values */
  cleanable?: boolean;

  /** Picker menu auto width */
  menuAutoWidth?: boolean;

  /** Called when Modal is displayed */
  onOpen?: () => void;

  /** Called when Modal is closed */
  onClose?: () => void;

  /** Custom render extra footer */
  renderExtraFooter?: () => React.ReactNode;
}

export interface FormControlBaseProps<ValueType = any> {
  /** Initial value */
  defaultValue?: ValueType;

  /** Current value of the component. Creates a controlled component */
  value?: ValueType;

  /** Called after the value has been changed */
  onChange?: (value: ValueType, event: React.SyntheticEvent<HTMLElement>) => void;
}

export interface FormControlPickerProps<ValueType = any, DataType = Record<string, any>>
  extends PickerBaseProps {
  /** The data of component */
  data: DataType[];

  /** Set option value 'key' in 'data' */
  valueKey?: keyof DataType;

  /** Set options to display the 'key' in 'data' */
  labelKey?: keyof DataType;

  /** Set children key in data */
  childrenKey?: keyof DataType;

  /** Disabled items */
  disabledItemValues?: ValueType[];

  /** Initial value */
  defaultValue?: ValueType;

  /** Current value of the component. Creates a controlled component */
  value?: ValueType;

  /** Called after the value has been changed */
  onChange?: (value: ValueType, event: React.SyntheticEvent<HTMLElement>) => void;
}

export declare namespace TypeAttributes {
  type Size = 'lg' | 'md' | 'sm' | 'xs';
  type Status = 'success' | 'warning' | 'error' | 'info';
  type Color = 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'violet';
  type Appearance = 'default' | 'primary' | 'link' | 'subtle' | 'ghost';
  type Placement4 = 'top' | 'bottom' | 'right' | 'left';
  type Placement8 =
    | 'bottomStart'
    | 'bottomEnd'
    | 'topStart'
    | 'topEnd'
    | 'leftStart'
    | 'rightStart'
    | 'leftEnd'
    | 'rightEnd';
  type PlacementAuto =
    | 'auto'
    | 'autoVertical'
    | 'autoVerticalStart'
    | 'autoVerticalEnd'
    | 'autoHorizontal'
    | 'autoHorizontalStart'
    | 'autoHorizontalEnd';

  type Placement = Placement4 | Placement8 | PlacementAuto;
  type CheckTrigger = 'change' | 'blur' | 'none';
}

export interface SVGIcon {
  viewBox: string;
  id: string;
}

export interface ItemDataType {
  label: any;
  value: any;
  groupBy?: string;
  parent?: ItemDataType;
  children?: ItemDataType[];
}

export interface SelectProps<ValueType = any> {
  /** Set group condition key in data */
  groupBy?: string;

  /** Sort options */
  sort?: (isGroup: boolean) => (a: any, b: any) => number;

  /** Whether dispaly search input box */
  searchable?: boolean;

  /** Customizing the Rendering Menu list */
  renderMenu?: (menu: React.ReactNode) => React.ReactNode;

  /** Custom render menuItems */
  renderMenuItem?: (label: React.ReactNode, item: ItemDataType) => React.ReactNode;

  /** Custom render menu group */
  renderMenuGroup?: (title: React.ReactNode, item: ItemDataType) => React.ReactNode;

  /** Custom render selected items */
  renderValue?: (
    value: ValueType,
    item: ItemDataType | ItemDataType[],
    selectedElement: React.ReactNode
  ) => React.ReactNode;

  /** Called when the option is selected */
  onSelect?: (value: any, item: ItemDataType, event: React.SyntheticEvent<any>) => void;

  /** Called after clicking the group title */
  onGroupTitleClick?: (event: React.SyntheticEvent<any>) => void;

  /** Called when searching */
  onSearch?: (searchKeyword: string, event: React.SyntheticEvent<any>) => void;

  /** Called when clean */
  onClean?: (event: React.SyntheticEvent<any>) => void;

  /** Whether using virtualized list */
  virtualized?: boolean;

  /**
   * List-related properties in `react-virtualized`
   * https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md#prop-types
   */
  listProps?: ListProps;

  /** Custom search rules. */
  searchBy?: (keyword: string, label: React.ReactNode, item: ItemDataType) => boolean;
}
