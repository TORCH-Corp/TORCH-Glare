import { create } from '@storybook/theming/create';
import { glareLogo } from './assets'
export default create({
    base: 'dark',
    brandTitle: 'TORCH Glare',
    brandUrl: 'https://torchcorp.com',
    brandImage: glareLogo,
    brandTarget: '_self',
    colorPrimary: '#9748FF',
    colorSecondary: '#3E1E69',

    // UI
    appBg: '#000000',
    appContentBg: '#000000',
    appPreviewBg: '#ffffff',
    appBorderColor: '#797C7F',
    appBorderRadius: 4,

    // Text colors
    textColor: '#ffffff',
    textInverseColor: '#ffffff',

    // Toolbar default and active colors
    barTextColor: '#626467',
    barSelectedColor: '#ffffff',
    barHoverColor: '#626467',
    barBg: '#000000',

    // Form colors
    inputBg: '#000000',
    inputBorder: '#797C7F',
    inputTextColor: '#ffffff',
    inputBorderRadius: 4
});