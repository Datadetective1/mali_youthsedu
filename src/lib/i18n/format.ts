/**
 * Message formatting.
 *
 * Dictionary entries that need a value are stored as strings with named
 * placeholders (`'{done} sur {total}'`) rather than as functions.
 *
 * That is not a style preference. A function cannot cross the server/client
 * boundary in React — passing a dictionary containing formatter functions into
 * a client component throws at runtime. Storing templates keeps the whole
 * dictionary serializable, so a server component can hand `t` straight to a
 * client component, and translators get a plain string to work with instead of
 * a code fragment.
 */

export type PluralMessage = { one: string; other: string };

/** Replaces `{name}` placeholders. Unknown placeholders are left untouched. */
export function format(
  template: string,
  values: Record<string, string | number> = {},
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/**
 * French plural selection.
 *
 * French treats 0 and 1 as singular ("0 étape", "1 étape"), which differs from
 * English — hence a real rule rather than `n === 1`.
 */
export function plural(
  message: PluralMessage,
  count: number,
  values: Record<string, string | number> = {},
): string {
  const template = Math.abs(count) < 2 ? message.one : message.other;
  return format(template, { n: count, count, ...values });
}
