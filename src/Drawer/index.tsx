import setDisplayName from 'recompose/setDisplayName';

import { defaultProps } from '../utils';
import Drawer, { DrawerProps } from './Drawer';
import ModalBody from '../Modal/ModalBody';
import ModalHeader from '../Modal/ModalHeader';
import ModalTitle from '../Modal/ModalTitle';
import ModalFooter from '../Modal/ModalFooter';

Drawer.Body = setDisplayName('Body')(defaultProps({ classPrefix: 'drawer-body' })(ModalBody));
Drawer.Header = defaultProps({ classPrefix: 'drawer-header' })(ModalHeader);
Drawer.Title = defaultProps({ classPrefix: 'drawer-title' })(ModalTitle);
Drawer.Footer = defaultProps({ classPrefix: 'drawer-footer' })(ModalFooter);

export default Drawer;
export { DrawerProps };
