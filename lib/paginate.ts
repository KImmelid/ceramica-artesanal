export type PageInfo = { page: number; perPage: number; total: number; pages: number };
export function pageInfo(total: number, page: number, perPage: number): PageInfo {
  const pages = Math.max(1, Math.ceil(total / perPage));
  const p = Math.min(Math.max(1, page), pages);
  return { total, page: p, perPage, pages };
}
export function prismaSkipTake(page: number, perPage: number) {
  return { skip: (page - 1) * perPage, take: perPage };
}

// Additional helpers used by some endpoints
export type PaginationMeta = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export function calcSkip(page: number, perPage: number): number {
  return Math.max(0, (page - 1) * perPage);
}

export function buildMeta(total: number, page: number, perPage: number): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  return {
    page: current,
    perPage,
    total,
    totalPages,
    hasNext: current < totalPages,
    hasPrev: current > 1,
  };
}
