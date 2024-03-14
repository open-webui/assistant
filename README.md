# Open WebUI Assistant

> [!NOTE]
> Please note that the current version of Open WebUI Assistant is compatible only with macOS systems. Support for other operating systems will be added in future releases.

Open WebUI Assistant is a companion app that allows you to insert text generated by your Open WebUI instance anywhere on your computer using keyboard shortcuts, and offers a user interface for setting up the server URL and JWT token. The two primary keyboard shortcuts are:

1. **Cmd+Option+i**: Use this shortcut when the text input field is active to request text completion from Open WebUI Assistant.
2. **Cmd+Option+o**: This command uses the normal chat API endpoint for interaction with your Open WebUI instance, not opening a separate chat window.

## Prerequisites

Before installing Open WebUI Assistant, make sure you have `make`, `node`, and `npm` installed on your system.

If you don't have `make` or `node` installed, install them using your system package manager or refer to the [official documentation](https://www.gnu.org/software/make/download.html) and [Node.js download page](https://nodejs.org/en/download).

 Thank you for pointing that out! I apologize for the confusion caused by using `sudo` in my previous instructions. The corrected installation section of the README should look like this:

## Installation

1. Clone Open WebUI Assistant's GitHub repository:
   ```bash
   git clone https://github.com/open-webui/assistant.git
   cd assistant
   ```

2. Run `make` to prepare the build environment:
   ```bash
   make
   ```

3. Install Open WebUI Assistant using the following command:
   ```bash
   make install
   ```
   
4. Configure Open WebUI Assistant:
   - After installation, find and run the Open WebUI Assistant companion app located in your user's `~/Applications` directory.
   - In the settings window, enter your Open WebUI server URL and the JWT token you can get from **Settings > Account** in the WebUI. The companion app's UI is just a setting interface for these two values.

5. Use Open WebUI Assistant:
   - After configuring Open WebUI Assistant, use the keyboard shortcuts **Cmd+Option+i** to request text completion or **Cmd+Option+o** for interaction with your Open WebUI instance using the normal chat API endpoint.

## Help Contribute
For more information, troubleshooting, or feature requests, visit [Open WebUI Assistant's GitHub repository](https://github.com/open-webui/assistant) or say hello in our [Discord server](https://discord.gg/5rJgQTnV4s).