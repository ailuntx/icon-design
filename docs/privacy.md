# Icon Design — Privacy

Effective date: 2026-09-10. Publisher: ailuntz. Website: https://www.ailuntz.com.

Icon Design is a local plugin containing workflow instructions and optional scripts. It does not operate a hosted account system, collect analytics, or send project files or credentials to the publisher.

The assistant may inspect the project files and images you choose, and save prompts, generated images, previews, generation receipts and icon assets in your local workspace. These files remain until you remove them. Their contents may also appear in your AI conversation; the AI platform's data practices apply to that conversation.

Image generation uses the provider you authorize. The optional OpenRouter adapter sends the prompt and, if you supply one, the selected reference image to OpenRouter and its selected model provider. Its API key is read from a process environment variable and used for authentication. It is not included in image prompts, plugin files, or the script's output receipts. Receipts contain generation status, model, quality, reported cost and a reference-image checksum when applicable. Provider processing, retention and account controls follow the relevant provider's policies; this plugin does not control or delete their records.

The local image-preparation and ICNS-packaging script makes no network requests. The plugin has no publisher-operated database, advertising or data-sale system. You can decline an API route, choose which references to send, remove local outputs, uninstall the plugin, and manage or revoke provider credentials through that provider. Removing local files or uninstalling does not remove copies in conversations or provider systems.

Downloading the plugin from GitHub or a plugin directory and using an AI platform involve those services and their policies. Support is available at https://github.com/ailuntx/icon-design/issues. Issues are public: do not include API keys, confidential project files, or private images.
