
# Brightness Control App

## Overview

Brightness Control App is a desktop application built with TauriJS, ReactTS, and Rust, specifically designed for Ubuntu users to manage the brightness of their screens. This app allows users to adjust the brightness of individual screens or all screens simultaneously using the `xrandr` command.

## Features

- **Individual Screen Brightness Control**: Adjust the brightness of each screen independently.
- **Combined Screen Brightness Control**: Change the brightness of all screens together.
- **Easy-to-use Interface**: Simple and intuitive user interface built with ReactTS.
- **Lightweight and Efficient**: Powered by Rust on the backend for optimal performance.

## Upcoming Features

- **Theme Settings**: Customize the look and feel of the app.
- **Startup Configuration**: Save custom brightness settings to be applied at startup.

## Installation

To install the Brightness Control App, download the latest `.deb` file from the [releases](./release) folder and install it using the following command:

```bash
sudo dpkg -i path/to/brightness.deb
```

## Usage

1. Launch the app from your applications menu.
2. Select the screen you want to adjust or choose to adjust all screens.
3. Use the slider to set the desired brightness level.
4. Click "Apply" to update the brightness.

### Commands Used

The app uses the following `xrandr` command to adjust screen brightness:

```bash
xrandr --output <output_name> --brightness <brightness_value>
```

Replace `<output_name>` with the specific screen output (e.g., `hdmi-1`) and `<brightness_value>` with a value between 0.0 (dim) and 1.0 (bright).

## Development

### Prerequisites

- **Node.js**: [Install Node.js](https://nodejs.org/)
- **Rust**: [Install Rust](https://www.rust-lang.org/)
- **Tauri CLI**: Install Tauri CLI globally by running the following command:
  
  ```bash
  cargo install tauri-cli
  ```


### Setup

Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/Roy-Bivash/Brightness
cd Brightness
```

Install dependencies:

```bash
npm install
```

### Run the App

To start the development server:

```bash
npm run tauri dev
```

### Build the App

To create a production build:

```bash
npm run tauri build
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your improvements or new features.

## License

This project is licensed under the MIT License.