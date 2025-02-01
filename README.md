# Component Storybook

This project contains a collection of reusable React components, with the main focus on a customizable Dropdown component. The project is built with Next.js and Storybook for component development and documentation.

## Getting Started

### Installation

```bash
# Install dependencies
npm install
# or
pnpm install
# or
yarn install
```

### Running Storybook

```bash
# Start Storybook development server
npm run storybook
# or
pnpm run storybook
# or
yarn storybook
```

Open [http://localhost:6006](http://localhost:6006) to view the Storybook interface.

## Dropdown Component

A flexible and customizable dropdown component that supports both single and multiple selection modes.

### Basic Usage

```tsx
import { Dropdown } from './src/stories/Dropdown';

// Single select dropdown
const SingleSelect = () => {
  const [value, setValue] = useState('');
  
  return (
    <Dropdown
      label="City"
      options={[
        { value: '1', label: 'Jakarta' },
        { value: '2', label: 'Surabaya' },
        { value: '3', label: 'Bandung' }
      ]}
      value={value}
      onChange={(newValue) => setValue(newValue)}
    />
  );
};

// Multi-select dropdown
const MultiSelect = () => {
  const [value, setValue] = useState<string[]>([]);
  
  return (
    <Dropdown
      label="Cities"
      options={[
        { value: '1', label: 'Jakarta' },
        { value: '2', label: 'Surabaya' },
        { value: '3', label: 'Bandung' }
      ]}
      value={value}
      onChange={(newValue) => setValue(newValue as string[])}
      multiple={true}
    />
  );
};
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | Optional ID for the dropdown |
| `label` | `string` | - | Label text displayed above the dropdown |
| `options` | `DropdownOption[]` | Required | Array of options to display |
| `multiple` | `boolean` | `false` | Enable multi-select mode |
| `withSearch` | `boolean` | `true` | Show search input field |
| `withPortal` | `boolean` | `true` | Render dropdown menu in a portal |
| `optionLabel` | `string` | `'label'` | Key to use for option labels |
| `value` | `string \| string[]` | Required | Selected value(s) |
| `onChange` | `(value: string \| string[]) => void` | Required | Change handler function |
| `className` | `string` | - | Additional CSS classes |
| `zIndex` | `number` | `1000` | Z-index for dropdown menu |

### Features

- Single and multiple selection modes
- Search functionality
- Customizable styling
- Keyboard navigation support
- Portal rendering for better stacking context
- Responsive design
- TypeScript support

## Demo Video

[Dropdown Component Demo](https://drive.google.com/file/d/1PTD6G6UAWgmuRJv2TdAxcYKL24IW06TN/view?usp=sharing)

Watch the demo video above to see the Dropdown component in action, showcasing features like:
- Single and multi-select modes
- Real-time search filtering
- Keyboard navigation
- Responsive design
- Portal rendering

## Development

### Running Tests

```bash
npm run test-storybook
# or
pnpm run test-storybook
# or
yarn test-storybook
```

### Building Storybook

```bash
npm run build-storybook
# or
pnpm run build-storybook
# or
yarn build-storybook
```

This will create a static version of Storybook in the `storybook-static` directory.
