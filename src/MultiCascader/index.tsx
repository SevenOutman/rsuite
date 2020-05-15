import MultiCascader, { MultiCascaderProps } from './MultiCascader';
import withLocale from '../IntlProvider/withLocale';

export default withLocale<MultiCascaderProps>(['Picker', 'MultiCascader'])(MultiCascader);
export { MultiCascaderProps };
