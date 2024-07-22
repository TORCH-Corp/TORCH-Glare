import type { Preview } from "@storybook/react";
import '../src/lib/styles/colors/colorMapping/default.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

};

export default preview;
