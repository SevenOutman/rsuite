import * as React from 'react';
import CheckTreePicker from '../CheckTreePicker';
import { TreeBaseProps } from '../Tree/TreeBase';
import { FormControlPickerProps } from '../@types/common';

export interface CheckTreeProps extends TreeBaseProps, FormControlPickerProps {
  /** The height of Dropdown */
  height?: number;

  /** Tree node cascade */
  cascade?: boolean;

  /** Whether using virtualized list */
  virtualized?: boolean;
}

const CheckTree = React.forwardRef<any, CheckTreeProps>((props, ref) => (
  <CheckTreePicker ref={ref} inline {...props} />
));

CheckTree.displayName = 'CheckTree';

export default CheckTree;
