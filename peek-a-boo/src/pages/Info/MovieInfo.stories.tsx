import type { Meta, StoryObj } from '@storybook/react';

import MovieInfo from './MovieInfo';

const meta = {
  component: MovieInfo,
} satisfies Meta<typeof MovieInfo>;

export default meta;

type Story = StoryObj<typeof meta>;
