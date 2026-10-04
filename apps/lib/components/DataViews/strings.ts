import { useHtmlLang } from "../../hooks/useHtmlLang";

/**
 * The strings DataViews paints itself, in the languages it ships.
 *
 * Everything a consumer authors is localized by passing it — view labels, panel tab labels, section
 * titles, the search placeholder, `addRowLabel`, a `boolean` field's `trueLabel`/`falseLabel`, an
 * `enum-badge` field's `labels`, `fields[].label`. None of those are here. What is left is the text
 * the component writes on screen itself, where there is no prop to hand it in through: the view
 * switcher's own tab names, the tree pane's heading, and one status line.
 *
 * Accessible names are deliberately NOT here. They stay English — see the localization section of
 * the DataViews reference.
 *
 * The language comes from `<html lang>` via `useHtmlLang`, so there is nothing to wire: an app that
 * switches language already writes that attribute, and the switch is observed.
 */

/** The shape both tables have to satisfy, so neither can drift from the other. */
export interface DataViewsStrings {
  noSortableColumns: string;
  /**
   * The view switcher's own tab names, keyed by the English default each built-in view declares.
   *
   * Keyed by the English rather than by a symbol so `markView` keeps its current signature: a view
   * of your own passes whatever `defaultLabel` it likes, finds no entry here, and shows its own
   * string untouched. Passing `label` on a view always wins over any of this.
   */
  viewLabels: Record<string, string>;
  /** The tree pane's heading when the selected node has no label field to read. */
  paneFallbackTitle: string;
}

/**
 * The Arabic reuses the vocabulary the consuming app has already settled on — `بحث`, `إغلاق`,
 * `الأعمدة`, `الصف`, `مسح`, `تحديد`, `الإعدادات` — so the component does not quietly disagree with
 * the interface around it.
 */
export const DATA_VIEWS_STRINGS = {
  en: {
    noSortableColumns: "No sortable columns.",
    viewLabels: {
      List: "List",
      Board: "Board",
      Inbox: "Inbox",
      Tree: "Tree",
      Cards: "Cards",
      Tab: "Tab",
    },
    paneFallbackTitle: "Items",
  },
  ar: {
    noSortableColumns: "لا توجد أعمدة قابلة للترتيب.",
    viewLabels: {
      List: "قائمة",
      Board: "لوحة",
      Inbox: "البريد الوارد",
      Tree: "شجرة",
      Cards: "بطاقات",
      Tab: "تبويب",
    },
    paneFallbackTitle: "العناصر",
  },
} satisfies Record<string, DataViewsStrings>;

/**
 * The strings for the active language, English for any language not shipped.
 *
 * Falling back to English rather than to the key is the point: a language the library has never
 * heard of still gets a usable accessible name instead of `undefined` read aloud.
 */
export function useDataViewsStrings(): DataViewsStrings {
  const lang = useHtmlLang();
  return (DATA_VIEWS_STRINGS as Record<string, DataViewsStrings>)[lang] ?? DATA_VIEWS_STRINGS.en;
}
