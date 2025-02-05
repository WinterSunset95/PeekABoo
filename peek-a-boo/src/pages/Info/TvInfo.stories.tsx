import type { Meta, StoryObj } from '@storybook/react';

import TvInfo from './TvInfo';

const meta = {
  component: TvInfo,
} satisfies Meta<typeof TvInfo>;

export default meta;

type Story = StoryObj<typeof meta>;
