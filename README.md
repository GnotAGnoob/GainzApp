# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Developing

Install dependencies with `pnpm add` and start a development server:

```bash
pnpm dev
```

### Master version mode in dev

```bash
pnpm master
```

## Building

To create a production version of your app:

```bash
pnpm build
```

You can preview the production build with `npm run preview`.

## Database

### Local Database

to run a local postgres database, install docker-desktop and run it. then run the following command:

```bash
pnpm docker
```

### Generate migration files

```bash
pnpm docker
```

### Migration

for making changes to the database

```bash
pnpm migrate
```

### Introspect

something about what happened

```bash
pnpm introspect
```

## Run Test

```bash
pnpm test
```

## Component library

https://www.svelteui.org
