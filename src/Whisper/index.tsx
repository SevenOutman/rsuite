import Whisper, { WhisperProps } from './Whisper';
import withLocale from '../IntlProvider/withLocale';

export default withLocale<WhisperProps>([])(Whisper);
export { WhisperProps };
