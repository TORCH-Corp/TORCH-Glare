import type { TreeFolderBreadcrumb, TreeFolderMoveArgs, TreeFolderNode } from "./types"

export function findPath(roots: TreeFolderNode[], id: string): TreeFolderNode[] | null {
  for (const root of roots) {
    const trail = walkPath(root, id, [])
    if (trail) return trail
  }
  return null
}

function walkPath(
  node: TreeFolderNode,
  id: string,
  trail: TreeFolderNode[],
): TreeFolderNode[] | null {
  const next = [...trail, node]
  if (node.id === id) return next
  if (node.children) {
    for (const c of node.children) {
      const found = walkPath(c, id, next)
      if (found) return found
    }
  }
  return null
}

export function toBreadcrumb(path: TreeFolderNode[]): TreeFolderBreadcrumb {
  return path.map((n) => ({ id: n.id, name: n.name }))
}

export function findNode(roots: TreeFolderNode[], id: string): TreeFolderNode | null {
  for (const root of roots) {
    if (root.id === id) return root
    if (root.children) {
      const inChild = findNode(root.children, id)
      if (inChild) return inChild
    }
  }
  return null
}

export function isAncestor(parent: TreeFolderNode, id: string): boolean {
  if (parent.id === id) return true
  if (!parent.children) return false
  for (const c of parent.children) {
    if (isAncestor(c, id)) return true
  }
  return false
}

export function descendantIds(node: TreeFolderNode, includeSelf = false): Set<string> {
  const out = new Set<string>()
  if (includeSelf) out.add(node.id)
  const walk = (n: TreeFolderNode) => {
    if (!n.children) return
    for (const c of n.children) {
      out.add(c.id)
      walk(c)
    }
  }
  walk(node)
  return out
}

export function applyMove(
  roots: TreeFolderNode[],
  args: TreeFolderMoveArgs,
): TreeFolderNode[] {
  const dragSet = new Set(args.dragIds)

  if (args.parentId) {
    for (const id of args.dragIds) {
      const node = findNode(roots, id)
      if (node && isAncestor(node, args.parentId)) return roots
    }
  }

  const extracted: TreeFolderNode[] = []

  const extract = (records: TreeFolderNode[]): TreeFolderNode[] =>
    records
      .map((n) => {
        const next: TreeFolderNode = n.children
          ? { ...n, children: extract(n.children) }
          : n
        if (dragSet.has(n.id)) {
          extracted.push(next)
          return null
        }
        return next
      })
      .filter((n): n is TreeFolderNode => n !== null)

  const pruned = extract(roots)

  if (args.parentId == null) {
    const at = Math.max(0, Math.min(args.index, pruned.length))
    return [...pruned.slice(0, at), ...extracted, ...pruned.slice(at)]
  }

  const insert = (records: TreeFolderNode[]): TreeFolderNode[] =>
    records.map((n) => {
      if (n.id === args.parentId) {
        const kids = n.children ? [...n.children] : []
        const at = Math.max(0, Math.min(args.index, kids.length))
        kids.splice(at, 0, ...extracted)
        return { ...n, children: kids }
      }
      if (n.children) return { ...n, children: insert(n.children) }
      return n
    })

  return insert(pruned)
}
