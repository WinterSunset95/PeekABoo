import type { Meta, StoryObj } from '@storybook/react';

import Card from './Card';

const meta = {
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		Id: "dandadan",
		Poster: "https://gogocdn.net/cover/dandadan.png",
		Title: "Dandadan",
		Type: "anime"
	}
};

export const Dandadan: Story = {
	args: {
		Id: "dandadan",
		Poster: "https://gogocdn.net/cover/dandadan.png",
		Title: "Dandadan",
		Type: "anime"
	}
};
