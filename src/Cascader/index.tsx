import Cascader, { CascaderProps } from './Cascader';
import withLocale from '../IntlProvider/withLocale';

export default withLocale<CascaderProps>(['Picker'])(Cascader);
export { CascaderProps };
