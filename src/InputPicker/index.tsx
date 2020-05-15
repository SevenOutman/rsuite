import InputPicker, { InputPickerProps } from './InputPicker';
import withLocale from '../IntlProvider/withLocale';

export default withLocale<InputPickerProps>(['Picker', 'InputPicker'])(InputPicker);
export { InputPickerProps };
