# TORCH Glare Components Library 

Welcome to the **TORCH Glare Components Library**! This library contains a collection of reusable React components that can be used to build user interfaces efficiently. Below, you will find instructions on how to install, use, and contribute to this library.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
4. [Contributing](#contributing)
5. [License](#license)

## Installation

To install the library, you can use npm or yarn:

### npm
```bash
 npm install torch-glare
```

### yarn

```bash
 yarn add torch-glare
```

## Usage

- you should import RemixIcons CDN in your index.html, copy this code below and paste in your html head tag:

```html
<head>
  <link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet" />
</head>
```

After installing the library, you can start using the components in your React project. Here's an example of how to import and use a component:

- this components include dark,light,default mods so you well find in styles/colors/colorMapping, this folder contains css files you should import one of them in order to have colors in your component, see this example :


```tsx
import React from 'react';
import {Button} from 'torch-glare/dist';
import 'torch-glare/dist/themes/colorMapping/dark.css'; // this well make the component theme dark

const App = () => {
  return (
    <div>
      <Button />
    </div>
  );
}

export default App;
```

## Contributing

We welcome contributions to enhance the library! To contribute, please follow these steps:

- Fork the repository.
- Create a new branch for your feature or bugfix.
- Make your changes and commit them with a clear message.
- Push your changes to your forked repository.
- Open a pull request to the main repository.

## Guidelines

- Ensure your code follows the existing style and conventions.
- Update the documentation if necessary.

# License
This project is licensed under the MIT License. 