import type { Meta, StoryObj } from '@storybook/react';

import AnimeInfo from './AnimeInfo';

const meta = {
  component: AnimeInfo,
} satisfies Meta<typeof AnimeInfo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		id: "dandadan"
	}
};

export const Anime: Story = {
	args: {
		id: "dandadan"
	}
};
