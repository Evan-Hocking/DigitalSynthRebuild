# Open Synth v2

## Introduction
Open Synth v2 is a virtual modular synthesizer designed for experimentation and performance. Originally developed as a university project, this version has been rebuilt from the ground up to address architectural issues in the original.

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [Git](https://git-scm.com/) (for cloning the repository)

## End User Installation

1. **Download the Executable:**
Navigate to [Releases](https://github.com/Evan-Hocking/DigitalSynthRebuild/releases) and download the latest release

2. **Run Executable**

## Dev Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/Evan-Hocking/DigitalSynthRebuild.git
    cd DigitalSynthRebuild
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```
    > **Note:** The `node_modules` directory is not included in the repository and will be created by this step.

## Usage

Start the Electron app with:
```bash
npm start
```
This will launch Open Synth in a desktop window.

### Custom Modules

To add your own modules, place `.mjs` files in the `Documents/OpenSynthModules` folder.  
A `template.mjs` is provided as a starting point, but it is ignored by the app.

## Development

- The main Electron entry point is [`main.js`](main.js).
- The synthesizer UI and logic are in the [`static/`](static/) directory.
- Modules are dynamically loaded from [`static/js/modules/`](static/js/modules/) and ['Documents/OpenSynthModules/'](Documents/OpenSynthModules/).


## License

&copy; 2025 Evan Richard Hocking

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
