# Sanity integration

Nothing here is wired up yet, and the site does not need it. Content currently
lives as typed seed data in `src/content/`, read through `src/lib/content/`.
That module is the only place a page touches content, so moving to Sanity means
changing one file.

## What already exists

| File                       | Purpose                                                                                      |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| `sanity/schemas/index.ts`  | Document schemas: settings, service, caseStudy, testimonial, clientLogo, insight, teamMember |
| `src/content/schema.ts`    | Zod schemas mirroring the same models, used to validate whatever arrives at runtime          |
| `src/lib/content/index.ts` | The content boundary — every accessor is already `async`                                     |
| `.env.example`             | The four variables Sanity needs                                                              |

The schemas are plain objects, not `defineType(...)` calls, so the repo does not
carry the `sanity` package before anyone has decided to use it. Sanity Studio
accepts plain objects; wrap them in `defineType` once the Studio exists if you
want the editor autocomplete.

## Wiring it up

1. Create a project at [sanity.io/manage](https://sanity.io/manage) and note the
   project id and dataset.

2. Install the client:

   ```bash
   pnpm add next-sanity @sanity/image-url
   ```

3. Fill these in `.env.local`:

   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID="…"
   NEXT_PUBLIC_SANITY_DATASET="production"
   NEXT_PUBLIC_SANITY_API_VERSION="2026-01-01"
   SANITY_API_READ_TOKEN="…"
   ```

   `SANITY_API_READ_TOKEN` is server-only. Never give it a `NEXT_PUBLIC_`
   prefix — that would ship it to the browser.

4. In `src/lib/content/index.ts`, put the GROQ fetch behind the existing
   `isCmsConfigured` branch and hand the result to the same `parseAll(...)`
   call the seed already goes through. For example:

   ```ts
   export async function getServices(): Promise<Service[]> {
     const documents = isCmsConfigured
       ? await client.fetch(`*[_type == "service"] | order(order asc)`)
       : seedServices;
     return parseAll(serviceSchema, documents, "service") as Service[];
   }
   ```

   Because the seed runs through the same validation on every build, the
   schemas are already exercised before they ever meet real CMS data.

5. Set a revalidation strategy. The pages are static today; either add
   `revalidate` to the routes that read CMS content, or add a webhook route
   that calls `revalidateTag`. Note that in Next 16 `revalidateTag` takes a
   second `cacheLife` argument.

## Rules the schemas enforce

Two of these are editorial policy, encoded so they cannot be forgotten:

- **A testimonial or client logo without `approved` ticked is never rendered.**
  `src/lib/content` filters on it before validating, so un-ticking the box in
  the CMS removes it from the site rather than breaking the build.
- **A case study marked `reserved` cannot carry results.** There is nothing to
  report until a project is real, and the Zod refinement rejects it.

## Images

`next/image` needs the Sanity CDN allow-listed once images come from there:

```ts
// next.config.ts
images: {
  remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
}
```

Every image field carries an `alt` sub-field. Fill it — the accessibility suite
asserts that no image ships without one.
