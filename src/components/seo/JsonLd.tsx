/**
 * Server-rendered JSON-LD block. Emits a single <script type="application/ld+json">
 * with the given schema object. Pass any Schema.org object.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // Safe: data is an object we control, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
