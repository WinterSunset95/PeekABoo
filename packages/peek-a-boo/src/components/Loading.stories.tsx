import type { Meta, StoryObj } from '@storybook/react';

import Loading from './Loading';

const meta = {
  component: Loading,
} satisfies Meta<typeof Loading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    choice: "card_large"
  }
};


export const List: Story = {
  args: {
    choice: "list"
  }
};

export const Card: Story = {
  args: {
    choice: "card"
  }
};