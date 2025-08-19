# Storyblok Tag Selector Field Plugin

This React project is designed to function as a Storyblok field plugin application. It lists all the tags in the Storyblok space for the user to choose from.

To remove the example code, simply delete the `src/components/` directory and alter the imports and returned `JSX` in `src/App.tsx`.

## Usage

For development, run the application locally with

```shell
npm run dev
```

and open the [Sandbox](https://plugin-sandbox.storyblok.com/field-plugin/).

To build the project, run

```shell
npm run build
```

Deploy the field plugin with the CLI. Issue a [personal access token](https://app.storyblok.com/#/me/account?tab=token), rename `.env.local.example` to `.env.example`, open the file, set the value `STORYBLOK_PERSONAL_ACCESS_TOKEN`, and run

```shell
npm run deploy
```

## Continuous delivery

Set up [continuous delivery](https://www.storyblok.com/docs/plugins/field-plugins/continuous-delivery) with the CLI. Define an environmental variable `STORYBLOK_PERSONAL_ACCESS_TOKEN`, and use the `--name` and `--skipPrompts` options as such:

```shell
npm run deploy --name $NAME --skipPrompts
```
