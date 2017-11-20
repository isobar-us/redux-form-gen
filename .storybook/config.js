import { configure } from '@storybook/react';
import '../css/styles.scss';

function loadStories() {
  require('../stories');
}

configure(loadStories, module);
