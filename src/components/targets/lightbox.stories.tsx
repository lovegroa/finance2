// Button.stories.ts|tsx

import type {Meta, StoryObj} from '@storybook/react';

import TargetTransactionsLightbox from './target-transactions-lightbox.component';
import {Provider} from 'react-redux';
import {store} from '../../store/store';
import {BrowserRouter} from 'react-router-dom';
import {defaultTheme} from '../../utils/themes/default.theme';
import {ThemeProvider} from '@emotion/react';
import {UndoRounded} from '@mui/icons-material';
const meta: Meta<typeof TargetTransactionsLightbox> = {
  component: TargetTransactionsLightbox,
};

export default meta;
type Story = StoryObj<typeof TargetTransactionsLightbox>;

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
          <TargetTransactionsLightbox
            setTransactions={() => undefined}
            transactions={[]}
            currency="GBP"
          />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  ),
};
