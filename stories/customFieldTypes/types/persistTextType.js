import textType from '../../../src/defaultFieldTypes/types/textType';

const persistTextType = (options) => ({
  ...textType(options),
  _genSkipCache: true
});

export default persistTextType;
