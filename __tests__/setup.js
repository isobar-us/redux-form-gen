import Frag from '../src/Frag';
window.Frag = Frag;

import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});
