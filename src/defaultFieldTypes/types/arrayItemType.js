import GenArrayItem from '../components/GenArrayItem';

const arrayItemType = ({field}) => ({
  _genComponent: GenArrayItem,
  _genSkipChildren: true
});

export default arrayItemType;
