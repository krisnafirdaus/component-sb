import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';
import { useState } from 'react';

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    Layout: "centered"
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-3xl mx-auto h-[400px] p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Dropdown>;

export default meta;

const options = [
  { value: '1', label: 'Jakarta' },
  { value: '2', label: 'Surabaya' },
  { value: '3', label: 'Bandung' },
  { value: '4', label: 'Medan' },
  { value: '5', label: 'Semarang' },
  { value: '6', label: 'Palembang' },
  { value: '7', label: 'Makassar' },
];

// Interactive wrapper component untuk mengelola state
const InteractiveDropdown = (args: any) => {
  const [value, setValue] = useState(args.value);
  return (
    <Dropdown
      {...args}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
        console.log('Value changed:', newValue);
      }}
    />
  );
};

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => <InteractiveDropdown {...args} />,
  args: {
    onChange: (newValue) => {
      console.log('Value changed:', newValue);
    },
    label: 'City',
    options,
    value: '',
    withSearch: true,
    optionLabel: 'label',
    multiple: false,
  },
};

export const MultiSelect: Story = {
  render: (args) => <InteractiveDropdown {...args} />,
  args: {
    onChange: (newValue) => {
      console.log('Value changed:', newValue);
    },
    label: 'Cities',
    options,
    value: [],
    withSearch: true,
    optionLabel: 'label',
    multiple: true,
  },
};

export const WithPreselectedValue: Story = {
  render: (args) => <InteractiveDropdown {...args} />,
  args: {
    onChange: (newValue) => {
      console.log('Value changed:', newValue);
    },
    label: 'City',
    options,
    value: '1',
    withSearch: true,
    optionLabel: 'label',
    multiple: false,
  },
};

export const WithMultiplePreselected: Story = {
  render: (args) => <InteractiveDropdown {...args} />,
  args: {
    onChange(value) {
      console.log('Value changed:', value);
    },
    label: 'Cities',
    options,
    value: ['1', '2'],
    withSearch: true,
    optionLabel: 'label',
    multiple: true,
  },
};