export const ARM_BASE = "/ai-relationship-manager";
export const ARM_API = "/api/arm";

export function armPath(subpath = "") {
  if (!subpath || subpath === "/") return ARM_BASE;
  return `${ARM_BASE}${subpath.startsWith("/") ? subpath : `/${subpath}`}`;
}

export function armApi(subpath: string) {
  return `${ARM_API}${subpath.startsWith("/") ? subpath : `/${subpath}`}`;
}
