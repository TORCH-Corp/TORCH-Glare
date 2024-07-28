import { addons } from '@storybook/manager-api';
import torchTheme from './torchTheme';
import './assets/styles/main.css';

addons.setConfig({
    theme: torchTheme,
});