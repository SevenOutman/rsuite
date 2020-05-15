import compose from 'recompose/compose';
import { TagProps } from '../Tag';

import { defaultProps } from '../utils';
import InputPicker from '../InputPicker/InputPicker';
import withLocale from '../IntlProvider/withLocale';
import { FormControlPickerProps, SelectProps } from '../@types/common';

export interface TagPickerProps<ValueType = any>
  extends FormControlPickerProps,
    SelectProps<ValueType[]> {
  /** Option to cache value when searching asynchronously */
  cacheData?: any[];

  /** Settings can create new options */
  creatable?: boolean;

  /**
   * Tag related props.
   * https://github.com/rsuite/rsuite/blob/master/src/Tag/Tag.d.ts
   */
  tagProps?: TagProps;
}

export default compose<TagPickerProps, TagPickerProps>(
  withLocale(['Picker', 'InputPicker']),
  defaultProps({ multi: true })
)(InputPicker);
