import CheckPicker, { CheckPickerProps } from './CheckPicker';
import withLocale from '../IntlProvider/withLocale';

export default withLocale<CheckPickerProps>(['Picker', 'CheckPicker'])(CheckPicker);
export { CheckPickerProps };
