/**
 * Sanity schemas for Løfte Studios.
 *
 * These are plain objects rather than `defineType(...)` calls so that the repo
 * does not have to carry the `sanity` package before anyone has decided to use
 * it — Sanity Studio accepts plain schema objects, and nothing here blocks
 * `pnpm build`. When the Studio is set up, wrap them in `defineType` for the
 * editor autocomplete and nothing else changes.
 *
 * Each type mirrors one model in `src/content/schema.ts`. Change one, change
 * the other: `src/lib/content` validates whatever arrives from the CMS against
 * those Zod schemas, so a field renamed here and not there fails loudly at the
 * fetch instead of silently rendering an empty section.
 *
 * See `sanity/README.md` for the wiring steps.
 */

const CAPABILITY_OPTIONS = [
  { title: "Copy", value: "copy" },
  { title: "Video", value: "video" },
  { title: "Visual", value: "visual" },
  { title: "Audio", value: "audio" },
  { title: "Localization", value: "localization" },
  { title: "Strategy", value: "strategy" },
];

const slugField = {
  name: "slug",
  title: "Slug",
  type: "slug",
  options: { source: "title", maxLength: 96 },
  validation: (Rule: { required: () => unknown }) => Rule.required(),
};

export const settings = {
  name: "settings",
  title: "Global settings",
  type: "document",
  // A singleton: one document, edited, never created twice.
  __experimental_actions: ["update", "publish"],
  fields: [
    { name: "name", title: "Studio name", type: "string" },
    { name: "tagline", title: "Tagline", type: "string" },
    { name: "description", title: "Meta description", type: "text", rows: 3 },
    { name: "legalName", title: "Registered legal name", type: "string" },
    { name: "email", title: "Enquiry inbox", type: "string" },
    { name: "phone", title: "Phone", type: "string" },
    { name: "address", title: "Postal address", type: "text", rows: 3 },
    { name: "city", title: "City", type: "string" },
    { name: "country", title: "Country", type: "string" },
    {
      name: "social",
      title: "Social profiles",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "href", title: "URL", type: "url" },
          ],
        },
      ],
    },
  ],
};

export const service = {
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    slugField,
    { name: "summary", title: "Summary", type: "text", rows: 3 },
    {
      name: "solves",
      title: "What it solves",
      description: "Sentences a client would say, in their words.",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "deliverables",
      title: "Deliverables",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "process",
      title: "Process",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Step", type: "string" },
            { name: "detail", title: "Detail", type: "text", rows: 3 },
          ],
        },
      ],
    },
    {
      name: "capabilities",
      title: "Capabilities",
      type: "array",
      of: [{ type: "string" }],
      options: { list: CAPABILITY_OPTIONS },
    },
    {
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", title: "Question", type: "string" },
            { name: "answer", title: "Answer", type: "text", rows: 3 },
          ],
        },
      ],
    },
  ],
};

export const caseStudy = {
  name: "caseStudy",
  title: "Case study",
  type: "document",
  fields: [
    {
      name: "status",
      title: "Status",
      type: "string",
      description:
        "Reserved slots render as abstract plates and are excluded from search indexing. Only set Published once the client has approved the work, the credit, and any result shown.",
      options: {
        list: [
          { title: "Reserved slot", value: "reserved" },
          { title: "Published", value: "published" },
        ],
        layout: "radio",
      },
      initialValue: "reserved",
    },
    { name: "reservedTitle", title: "Reserved slot title", type: "string" },
    {
      name: "reservedSummary",
      title: "Reserved slot summary",
      type: "text",
      rows: 2,
    },
    { name: "title", title: "Title", type: "string" },
    slugField,
    {
      name: "client",
      title: "Client",
      description: "Leave empty if the client approved the work but not the name.",
      type: "string",
    },
    { name: "sector", title: "Sector", type: "string" },
    {
      name: "capabilities",
      title: "Capabilities",
      type: "array",
      of: [{ type: "string" }],
      options: { list: CAPABILITY_OPTIONS },
    },
    { name: "challenge", title: "Challenge", type: "text", rows: 4 },
    { name: "approach", title: "Approach", type: "text", rows: 6 },
    {
      name: "deliverables",
      title: "Deliverables",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "cover",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alternative text",
          type: "string",
          description: "What the image shows, for someone who cannot see it.",
        },
      ],
    },
    {
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", title: "Alternative text", type: "string" }],
        },
      ],
    },
    {
      name: "results",
      title: "Results",
      description:
        "Only figures the client has supplied and approved. Never an estimate, and never a number that cannot be sourced.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "value", title: "Value", type: "string" },
          ],
        },
      ],
    },
  ],
};

export const testimonial = {
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    { name: "quote", title: "Quote", type: "text", rows: 4 },
    {
      name: "attribution",
      title: "Attribution",
      description: "Name, role, company — exactly as the client approved it.",
      type: "string",
    },
    {
      name: "approved",
      title: "Written approval on file",
      description:
        "The site will not render this until it is ticked. Do not tick it without the email.",
      type: "boolean",
      initialValue: false,
    },
  ],
};

export const clientLogo = {
  name: "clientLogo",
  title: "Client logo",
  type: "document",
  fields: [
    { name: "name", title: "Client name", type: "string" },
    { name: "asset", title: "Logo (SVG preferred)", type: "image" },
    {
      name: "approved",
      title: "Permission to display on file",
      description: "The site will not render this until it is ticked.",
      type: "boolean",
      initialValue: false,
    },
  ],
};

export const insight = {
  name: "insight",
  title: "Note",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    slugField,
    { name: "standfirst", title: "Standfirst", type: "text", rows: 3 },
    { name: "category", title: "Category", type: "string" },
    { name: "date", title: "Published", type: "date" },
    { name: "author", title: "Author", type: "string" },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Template sample", value: "sample" },
          { title: "Published", value: "published" },
        ],
        layout: "radio",
      },
      initialValue: "sample",
    },
    {
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "ogImage",
      title: "Social image",
      type: "image",
      description: "Falls back to the site default when empty.",
    },
  ],
};

export const teamMember = {
  name: "teamMember",
  title: "Team member",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string" },
    { name: "role", title: "Role", type: "string" },
    {
      name: "portrait",
      title: "Portrait",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alternative text", type: "string" }],
    },
    { name: "bio", title: "Short bio", type: "text", rows: 3 },
    { name: "order", title: "Display order", type: "number" },
  ],
};

export const schemaTypes = [
  settings,
  service,
  caseStudy,
  testimonial,
  clientLogo,
  insight,
  teamMember,
];
