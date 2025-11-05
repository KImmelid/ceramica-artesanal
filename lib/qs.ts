export function qpNumber(v: string | null, def = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}
export function qpString(v: string | null, def = "") {
  return v ? String(v) : def;
}
export function qpEnum<T extends string>(v: string | null, allowed: T[], def: T): T {
  return (v && allowed.includes(v as T)) ? (v as T) : def;
}

// Extended list query parser used by some endpoints
export type Sort = { field: string; direction: "asc" | "desc" };
export type ListQuery = {
  q?: string;
  page: number;
  perPage: number;
  sort: Sort | null;
  dateFrom?: Date;
  dateTo?: Date;
};

type ParseOptions = {
  allowedSort?: string[];
  defaultSort?: Sort | null;
  defaultPerPage?: number;
  maxPerPage?: number;
};

export function parseListQuery(url: string, opts: ParseOptions = {}): ListQuery {
  const {
    allowedSort = ["createdAt"],
    defaultSort = { field: "createdAt", direction: "desc" },
    defaultPerPage = 20,
    maxPerPage = 100,
  } = opts;

  const u = new URL(url, "http://localhost");
  const sp = u.searchParams;

  const q = (sp.get("q") || undefined)?.toString().trim();

  const pageRaw = qpNumber(sp.get("page"), 1);
  const perPageRaw = qpNumber(sp.get("perPage"), defaultPerPage);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
  const perPage = Number.isFinite(perPageRaw)
    ? Math.min(Math.max(Math.floor(perPageRaw), 1), maxPerPage)
    : defaultPerPage;

  const sortParam = sp.get("sort") || undefined; // e.g. "createdAt:desc"
  let sort: Sort | null = null;
  if (sortParam) {
    const [fieldRaw, dirRaw] = sortParam.split(":", 2);
    const field = fieldRaw || "createdAt";
    const direction: "asc" | "desc" = dirRaw === "asc" ? "asc" : "desc";
    if (allowedSort.includes(field)) {
      sort = { field, direction };
    }
  }
  if (!sort && defaultSort) sort = defaultSort;

  const dateFromStr = sp.get("dateFrom") || undefined;
  const dateToStr = sp.get("dateTo") || undefined;
  const dateFrom = dateFromStr ? new Date(dateFromStr) : undefined;
  const dateTo = dateToStr ? new Date(dateToStr) : undefined;
  const validDate = (d?: Date) => (d && !Number.isNaN(d.getTime()) ? d : undefined);

  return {
    q,
    page,
    perPage,
    sort,
    dateFrom: validDate(dateFrom),
    dateTo: validDate(dateTo),
  };
}
