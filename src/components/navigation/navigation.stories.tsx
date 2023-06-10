// Button.stories.ts|tsx

import type {Meta, StoryObj} from '@storybook/react';

import Navigation from './navigation.component';
import {Provider} from 'react-redux';
import {store} from '../../store/store';
import {BrowserRouter} from 'react-router-dom';
import {defaultTheme} from '../../utils/themes/default.theme';
import {ThemeProvider} from '@emotion/react';
const meta: Meta<typeof Navigation> = {
  component: Navigation,
};

export default meta;
type Story = StoryObj<typeof Navigation>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={defaultTheme}>
          <Navigation />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  ),
};
