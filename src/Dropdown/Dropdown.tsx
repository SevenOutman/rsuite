import React, { useRef, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import kebabCase from 'lodash/kebabCase';
import DropdownToggle from './DropdownToggle';
import DropdownMenu from './DropdownMenu';
import MenuItem from './MenuItem';
import {
  shallowEqual,
  createChainedFunction,
  isOneOf,
  useClassNames,
  placementPolyfill,
  PLACEMENT_8,
  useRootClose,
  useControlled,
  KEY_VALUES
} from '../utils';
import { SidenavContext, SidenavContextType } from '../Sidenav/Sidenav';
import { TypeAttributes, WithAsProps, RsRefForwardingComponent } from '../@types/common';
import { IconProps } from '@rsuite/icons/lib/Icon';
import useUniqueId from '../utils/useUniqueId';
import DropdownContext from './DropdownContext';
import MenuControlContext from './MenuControlContext';
import useMenuControl from './useMenuControl';

export type DropdownTrigger = 'click' | 'hover' | 'contextMenu';
export interface DropdownProps<T = any>
  extends WithAsProps,
    Omit<React.HTMLAttributes<HTMLElement>, 'onSelect' | 'title'> {
  /** Define the title as a submenu */
  title?: React.ReactNode;

  /** Set the icon */
  icon?: React.ReactElement<IconProps>;

  /** The option to activate the state, corresponding to the eventkey in the Dropdown.item */
  activeKey?: T;

  /** Triggering events */
  trigger?: DropdownTrigger | DropdownTrigger[];

  /** The placement of Menu */
  placement?: TypeAttributes.Placement8;

  /** Whether or not component is disabled */
  disabled?: boolean;

  /** The style of the menu */
  menuStyle?: React.CSSProperties;

  /** A css class to apply to the Toggle DOM node */
  toggleClassName?: string;

  /** The value of the current option */
  eventKey?: T;

  /** You can use a custom element type for this toggle component */
  toggleAs?: React.ElementType;

  /** No caret variation */
  noCaret?: boolean;

  /** Open the menu and control it */
  open?: boolean;

  /** Whether Dropdown menu shows header  */
  showHeader?: boolean;

  /** Custom title */
  renderTitle?: (children?: React.ReactNode) => React.ReactNode;

  /** The callback function that the menu closes */
  onClose?: () => void;

  /** Menu Pop-up callback function */
  onOpen?: () => void;

  /** Callback function for menu state switching */
  onToggle?: (open?: boolean) => void;

  /** Selected callback function */
  onSelect?: (eventKey: T, event: React.MouseEvent<HTMLElement>) => void;

  /**
   * Opens by default
   * @internal Only used for testing
   */
  defaultOpen?: boolean;
}

export interface DropdownComponent extends RsRefForwardingComponent<'div', DropdownProps> {
  Item: typeof MenuItem;
  Menu: typeof DropdownMenu;
}

const defaultProps: Partial<DropdownProps> = {
  as: 'div',
  classPrefix: 'dropdown',
  placement: 'bottomStart',
  trigger: 'click',
  tabIndex: 0
};

const Dropdown: DropdownComponent = (React.forwardRef((props: DropdownProps, ref) => {
  const {
    as: Component,
    title,
    children,
    className,
    menuStyle,
    disabled,
    renderTitle,
    classPrefix,
    placement,
    activeKey,
    toggleClassName,
    trigger,
    icon,
    eventKey,
    toggleAs,
    noCaret,
    style,
    open: openProp,
    showHeader,
    onClick,
    onMouseEnter,
    onMouseLeave,
    onContextMenu,
    onSelect,
    onOpen,
    onClose,
    onToggle,
    defaultOpen = false,
    ...rest
  } = props;

  const { onOpenChange, openKeys = [], sidenav, expanded } =
    useContext<SidenavContextType>(SidenavContext) || {};
  const overlayTarget = useRef<HTMLUListElement>();
  const triggerTarget = useRef<HTMLButtonElement>();
  const [open, setOpen] = useControlled(openProp, defaultOpen);
  const menuExpanded = openKeys.some(key => shallowEqual(key, eventKey));
  const { merge, withClassPrefix, prefix } = useClassNames(classPrefix);
  const collapsible = sidenav && expanded;

  const buttonId = useUniqueId(prefix`button-`);
  const menuId = useUniqueId(prefix`menu-`);

  const menuControl = useMenuControl(overlayTarget);

  const handleToggle = useCallback(
    (isOpen?: boolean) => {
      const nextOpen = typeof isOpen === 'undefined' ? !open : isOpen;
      const fn = nextOpen ? onOpen : onClose;

      fn?.();
      setOpen(nextOpen);
      onToggle?.(nextOpen);

      // When closing the menu, move focus back to button
      if (!nextOpen) {
        requestAnimationFrame(() => {
          triggerTarget.current.focus();
        });
      }
    },
    [onClose, onOpen, onToggle, open, setOpen]
  );

  const handleOpenChange = useCallback(
    (event: React.MouseEvent) => {
      onOpenChange?.(eventKey, event);
    },
    [eventKey, onOpenChange]
  );

  const handleToggleChange = useCallback(
    (eventKey: any, event: React.SyntheticEvent<any>) => {
      onOpenChange?.(eventKey, event);
    },
    [onOpenChange]
  );

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      if (disabled) {
        return;
      }
      handleToggle();
    },
    [disabled, handleToggle]
  );

  const handleMouseEnter = useCallback(() => {
    if (!disabled) {
      handleToggle(true);
    }
  }, [disabled, handleToggle]);

  const handleMouseLeave = useCallback(() => {
    if (!disabled) {
      handleToggle(false);
    }
  }, [disabled, handleToggle]);

  const handleSelect = (eventKey: any, event: React.MouseEvent<HTMLElement>) => {
    onSelect?.(eventKey, event);
    handleToggle(false);
  };

  useRootClose(() => handleToggle(), {
    triggerTarget,
    overlayTarget,
    disabled: !open,
    // Don't use global Escape listener
    // Menu implements its own
    listenEscape: false
  });

  const dropdownProps = {
    onMouseEnter,
    onMouseLeave
  };

  /**
   * Keyboard interaction on menu button
   * @see https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-13
   */
  const handleButtonKeydown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      switch (e.key) {
        // Open the menu
        case KEY_VALUES.ENTER:
        case KEY_VALUES.SPACE:
          e.preventDefault();
          e.stopPropagation();
          if (!open) {
            handleToggle(true);
            menuControl.focusItemAt(0);
          } else {
            handleToggle(false);
          }
          break;
        default:
          break;
      }
    },
    [handleToggle, menuControl.focusItemAt]
  );

  const toggleProps = {
    onClick: createChainedFunction(handleOpenChange, onClick),
    onContextMenu,
    onKeyDown: handleButtonKeydown
  };

  /**
   * Bind event of trigger,
   * not used in  in the expanded state of '<Sidenav>'
   */
  if (!collapsible) {
    if (isOneOf('click', trigger)) {
      toggleProps.onClick = createChainedFunction(handleClick, toggleProps.onClick);
    }

    if (isOneOf('contextMenu', trigger)) {
      toggleProps.onContextMenu = createChainedFunction(handleClick, onContextMenu);
    }

    if (isOneOf('hover', trigger)) {
      dropdownProps.onMouseEnter = createChainedFunction(handleMouseEnter, onMouseEnter);
      dropdownProps.onMouseLeave = createChainedFunction(handleMouseLeave, onMouseLeave);
    }
  }

  // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#wai-aria-roles-states-and-properties-14
  const buttonAriaAttributes = {
    role: 'button',
    'aria-haspopup': 'menu',
    'aria-expanded': open || undefined, // it's recommend to remove aria-expanded when menu is hidden
    'aria-controls': menuId
  };

  const toggleElement = (
    <DropdownToggle
      {...rest}
      {...toggleProps}
      id={buttonId}
      {...buttonAriaAttributes}
      ref={triggerTarget}
      as={renderTitle ? 'span' : toggleAs}
      noCaret={noCaret}
      className={toggleClassName}
      renderTitle={renderTitle}
      icon={icon}
      placement={placement}
      inSidenav={sidenav}
    >
      {title}
    </DropdownToggle>
  );

  /**
   * Keyboard interaction on menu
   * @see https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-12
   */
  const handleMenuKeydown = useCallback((e: React.KeyboardEvent<HTMLUListElement>) => {
    switch (e.key) {
      // Close the menu
      case KEY_VALUES.ESC:
        e.preventDefault();
        e.stopPropagation();
        handleToggle(false);
        requestAnimationFrame(() => {
          // Move focus back to button
          triggerTarget.current.focus();
        });
        break;
      default:
        break;
    }
  }, []);

  const menuEventHandlers: React.HTMLAttributes<HTMLUListElement> = {
    onKeyDown: handleMenuKeydown
  };

  const menuAriaAttributes = {
    'aria-labelledby': buttonId
  };

  const menuElement = (
    <DropdownMenu
      expanded={menuExpanded}
      style={menuStyle}
      onSelect={handleSelect as any}
      onToggle={handleToggleChange}
      collapsible={collapsible}
      activeKey={activeKey}
      openKeys={openKeys}
      ref={overlayTarget}
      hidden={!open}
      {...{ id: menuId, ...menuAriaAttributes }}
      {...menuEventHandlers}
    >
      {showHeader && <li className={prefix('header')}>{title}</li>}
      {children}
    </DropdownMenu>
  );

  const classes = merge(
    className,
    withClassPrefix({
      [`placement-${kebabCase(placementPolyfill(placement))}`]: placement,
      [menuExpanded ? 'expand' : 'collapse']: sidenav,
      disabled,
      open,
      'no-caret': noCaret
    })
  );

  return (
    <DropdownContext.Provider
      value={{
        activeKey
      }}
    >
      <Component {...dropdownProps} ref={ref} style={style} className={classes}>
        {toggleElement}
        <MenuControlContext.Provider value={menuControl}>{menuElement}</MenuControlContext.Provider>
      </Component>
    </DropdownContext.Provider>
  );
}) as unknown) as DropdownComponent;

Dropdown.Item = MenuItem;
Dropdown.Menu = DropdownMenu;

Dropdown.displayName = 'Dropdown';
Dropdown.defaultProps = defaultProps;
Dropdown.propTypes = {
  activeKey: PropTypes.any,
  classPrefix: PropTypes.string,
  trigger: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.oneOf(['click', 'hover', 'contextMenu'])
  ]),
  placement: PropTypes.oneOf(PLACEMENT_8),
  title: PropTypes.node,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  menuStyle: PropTypes.object,
  className: PropTypes.string,
  toggleClassName: PropTypes.string,
  children: PropTypes.node,
  tabIndex: PropTypes.number,
  open: PropTypes.bool,
  eventKey: PropTypes.any,
  as: PropTypes.elementType,
  toggleAs: PropTypes.elementType,
  noCaret: PropTypes.bool,
  showHeader: PropTypes.bool,
  style: PropTypes.object,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  onToggle: PropTypes.func,
  onSelect: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onContextMenu: PropTypes.func,
  onClick: PropTypes.func,
  renderTitle: PropTypes.func
};

export default Dropdown;
