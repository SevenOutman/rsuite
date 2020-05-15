import DatePicker, { DatePickerProps } from './DatePicker';
import withLocale from '../IntlProvider/withLocale';

export default withLocale<DatePickerProps>(['DatePicker'])(DatePicker);
export { DatePickerProps };
