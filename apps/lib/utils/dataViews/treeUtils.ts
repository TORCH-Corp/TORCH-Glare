import type { DynamicRecord, TreeConfig } from "../../components/DataViews/types"
import { getByPath, setByPath } from "./pathUtils"

export type TreeNode = {
  id: string
  record: DynamicRecord
  children: TreeNode[]
  depth: number
  parent: TreeNode | null
}

export type ResolvedTreeConfig = {
  childrenField?: string
  parentField?: string
  idField: string
  orderField?: string
  nodeLabel?: string
  defaultExpanded: "all" | "roots" | "none"
}

const CHILDREN_PATTERNS = ["children", "items", "kids", "subItems", "nodes"]
const PARENT_PATTERNS  = ["parentId", "parent_id", "parent", "managerId", "manager"]
const ID_PATTERNS      = ["id", "_id", "uuid", "key"]

export function autoDetectTreeShape(
  data: DynamicRecord[],
  config: TreeConfig,
): ResolvedTreeConfig {
  const sample = data.find((r) => r != null && typeof r === "object") ?? {}

  const idField = config.idField ?? pickKey(sample, ID_PATTERNS) ?? "id"

  let childrenField = config.childrenField
  let parentField = config.parentField

  if (!childrenField && !parentField) {
    childrenField = pickArrayKey(sample, CHILDREN_PATTERNS)
    if (!childrenField) parentField = pickKey(sample, PARENT_PATTERNS)
  }

  return {
    childrenField,
    parentField,
    idField,
    orderField: config.orderField,
    nodeLabel: config.nodeLabel,
    defaultExpanded: config.defaultExpanded ?? "roots",
  }
}

function pickKey(record: DynamicRecord, candidates: string[]): string | undefined {
  for (const key of candidates) {
    if (key in record) return key
  }
  return undefined
}

function pickArrayKey(record: DynamicRecord, candidates: string[]): string | undefined {
  for (const key of candidates) {
    if (key in record && Array.isArray(record[key])) return key
  }
  return undefined
}

export function buildTree(
  data: DynamicRecord[],
  config: ResolvedTreeConfig,
): TreeNode[] {
  if (!data || data.length === 0) return []
  if (config.childrenField) return buildFromNested(data, config)
  if (config.parentField)   return buildFromFlat(data, config)
  return data.map((record, idx) => makeNode(record, config, idx, null, 0))
}

function buildFromNested(
  data: DynamicRecord[],
  config: ResolvedTreeConfig,
): TreeNode[] {
  const seen = new Set<string>()

  const visit = (record: DynamicRecord, depth: number, parent: TreeNode | null, idx: number): TreeNode => {
    const node = makeNode(record, config, idx, parent, depth)
    if (seen.has(node.id)) {
      return { ...node, children: [] }
    }
    seen.add(node.id)

    const rawChildren = getByPath(record, config.childrenField)
    if (Array.isArray(rawChildren)) {
      node.children = rawChildren.map((child, ci) => visit(child, depth + 1, node, ci))
    }
    return node
  }

  return data.map((record, idx) => visit(record, 0, null, idx))
}

function buildFromFlat(
  data: DynamicRecord[],
  config: ResolvedTreeConfig,
): TreeNode[] {
  const byId = new Map<string, TreeNode>()
  for (let i = 0; i < data.length; i++) {
    const record = data[i]
    const id = String(getByPath(record, config.idField) ?? `__row${i}`)
    byId.set(id, {
      id,
      record,
      children: [],
      depth: 0,
      parent: null,
    })
  }

  const roots: TreeNode[] = []
  for (const node of byId.values()) {
    const parentId = getByPath(node.record, config.parentField)
    if (parentId == null) {
      roots.push(node)
      continue
    }
    const parent = byId.get(String(parentId))
    if (!parent || parent === node) {
      roots.push(node)
      continue
    }
    node.parent = parent
    parent.children.push(node)
  }

  const setDepth = (n: TreeNode, d: number, guard = new Set<TreeNode>()) => {
    if (guard.has(n)) return
    guard.add(n)
    n.depth = d
    for (const c of n.children) setDepth(c, d + 1, guard)
  }
  for (const r of roots) setDepth(r, 0)

  return roots
}

function makeNode(
  record: DynamicRecord,
  config: ResolvedTreeConfig,
  idx: number,
  parent: TreeNode | null,
  depth: number,
): TreeNode {
  const idValue = getByPath(record, config.idField)
  const id = idValue != null ? String(idValue) : `__row${idx}`
  return { id, record, children: [], depth, parent }
}

export function findNodeById(roots: TreeNode[], id: string): TreeNode | null {
  for (const root of roots) {
    if (root.id === id) return root
    const inChild = findNodeById(root.children, id)
    if (inChild) return inChild
  }
  return null
}

export function* walk(node: TreeNode): Generator<TreeNode> {
  yield node
  for (const c of node.children) yield* walk(c)
}

export function flatten(node: TreeNode): DynamicRecord[] {
  const out: DynamicRecord[] = []
  for (const n of walk(node)) out.push(n.record)
  return out
}

export function descendantIds(node: TreeNode): Set<string> {
  const out = new Set<string>()
  for (const n of walk(node)) out.add(n.id)
  return out
}

export function allIds(roots: TreeNode[]): Set<string> {
  const out = new Set<string>()
  for (const r of roots) for (const n of walk(r)) out.add(n.id)
  return out
}

export function initialExpansion(roots: TreeNode[], mode: "all" | "roots" | "none"): Set<string> {
  if (mode === "none") return new Set()
  if (mode === "roots") return new Set(roots.map((r) => r.id))
  return allIds(roots)
}

export function flattenAll(data: DynamicRecord[], childrenField: string): DynamicRecord[] {
  const out: DynamicRecord[] = []
  const dfs = (record: DynamicRecord) => {
    if (record == null || typeof record !== "object") return
    const { [childrenField]: kids, ...rest } = record
    out.push(rest as DynamicRecord)
    if (Array.isArray(kids)) for (const k of kids) dfs(k)
  }
  for (const r of data) dfs(r)
  return out
}

export type MoveArgs = {
  dragIds: string[]
  parentId: string | null
  index: number
}

export function applyMove(
  data: DynamicRecord[],
  config: ResolvedTreeConfig,
  args: MoveArgs,
): DynamicRecord[] {
  if (config.childrenField) return applyMoveNested(data, config, args)
  if (config.parentField) return applyMoveFlat(data, config, args)
  return applyMoveTopLevel(data, config, args)
}

function recordId(record: DynamicRecord, idField: string, fallbackIdx: number): string {
  const v = getByPath(record, idField)
  return v != null ? String(v) : `__row${fallbackIdx}`
}

function applyMoveTopLevel(
  data: DynamicRecord[],
  config: ResolvedTreeConfig,
  args: MoveArgs,
): DynamicRecord[] {
  const ids = new Set(args.dragIds)
  const dragged: DynamicRecord[] = []
  const remaining: DynamicRecord[] = []
  data.forEach((rec, i) => {
    if (ids.has(recordId(rec, config.idField, i))) dragged.push(rec)
    else remaining.push(rec)
  })
  const target = args.parentId == null ? remaining : remaining
  const insertAt = Math.max(0, Math.min(args.index, target.length))
  return [...target.slice(0, insertAt), ...dragged, ...target.slice(insertAt)]
}

function applyMoveFlat(
  data: DynamicRecord[],
  config: ResolvedTreeConfig,
  args: MoveArgs,
): DynamicRecord[] {
  const idField = config.idField
  const parentField = config.parentField!
  const orderField = config.orderField

  const dragSet = new Set(args.dragIds)

  if (args.parentId) {
    for (const d of data) {
      const id = String(getByPath(d, idField) ?? "")
      if (!dragSet.has(id)) continue
      let cur: string | null = args.parentId
      while (cur) {
        if (cur === id) return data
        const search = cur
        const parentRec = data.find((r) => String(getByPath(r, idField) ?? "") === search)
        if (!parentRec) break
        const next = getByPath(parentRec, parentField)
        cur = next == null ? null : String(next)
      }
    }
  }

  const updatedParent: DynamicRecord[] = data.map((rec) => {
    const id = String(getByPath(rec, idField) ?? "")
    if (!dragSet.has(id)) return rec
    return setByPath(rec, parentField, args.parentId ?? null)
  })

  if (!orderField) return updatedParent

  const siblingsAfter = updatedParent.filter((rec) => {
    const p = getByPath(rec, parentField)
    const norm = p == null ? null : String(p)
    return norm === (args.parentId ?? null)
  })

  const dragged: DynamicRecord[] = []
  const others: DynamicRecord[] = []
  siblingsAfter.forEach((rec) => {
    const id = String(getByPath(rec, idField) ?? "")
    if (dragSet.has(id)) dragged.push(rec)
    else others.push(rec)
  })

  const insertAt = Math.max(0, Math.min(args.index, others.length))
  const newOrder = [...others.slice(0, insertAt), ...dragged, ...others.slice(insertAt)]
  const orderById = new Map<string, number>()
  newOrder.forEach((rec, i) => {
    const id = String(getByPath(rec, idField) ?? "")
    orderById.set(id, i)
  })

  return updatedParent.map((rec) => {
    const id = String(getByPath(rec, idField) ?? "")
    if (!orderById.has(id)) return rec
    return setByPath(rec, orderField, orderById.get(id)!)
  })
}

function applyMoveNested(
  data: DynamicRecord[],
  config: ResolvedTreeConfig,
  args: MoveArgs,
): DynamicRecord[] {
  const childrenField = config.childrenField!
  const idField = config.idField
  const dragSet = new Set(args.dragIds)

  const isAncestorOfDrag = (record: DynamicRecord, ancestors: DynamicRecord[]): boolean => {
    const id = String(getByPath(record, idField) ?? "")
    if (dragSet.has(id)) {
      for (const a of ancestors) {
        const aid = String(getByPath(a, idField) ?? "")
        if (aid === args.parentId) return true
      }
    }
    const kids = getByPath(record, childrenField)
    if (Array.isArray(kids)) {
      for (const k of kids) {
        if (isAncestorOfDrag(k, [...ancestors, record])) return true
      }
    }
    return false
  }
  for (const r of data) if (isAncestorOfDrag(r, [])) return data

  const extracted: DynamicRecord[] = []
  const extract = (records: DynamicRecord[]): DynamicRecord[] =>
    records
      .map((rec) => {
        const id = String(getByPath(rec, idField) ?? "")
        const kids = getByPath(rec, childrenField)
        const newKids = Array.isArray(kids) ? extract(kids) : kids
        const next = Array.isArray(kids) ? setByPath(rec, childrenField, newKids) : rec
        if (dragSet.has(id)) {
          extracted.push(next)
          return null
        }
        return next
      })
      .filter((r): r is DynamicRecord => r !== null)

  let pruned = extract(data)

  const insert = (records: DynamicRecord[]): DynamicRecord[] =>
    records.map((rec) => {
      const id = String(getByPath(rec, idField) ?? "")
      if (id === args.parentId) {
        const kids = getByPath(rec, childrenField)
        const arr = Array.isArray(kids) ? [...kids] : []
        const at = Math.max(0, Math.min(args.index, arr.length))
        arr.splice(at, 0, ...extracted)
        return setByPath(rec, childrenField, arr)
      }
      const kids = getByPath(rec, childrenField)
      if (Array.isArray(kids)) {
        return setByPath(rec, childrenField, insert(kids))
      }
      return rec
    })

  if (args.parentId == null) {
    const at = Math.max(0, Math.min(args.index, pruned.length))
    return [...pruned.slice(0, at), ...extracted, ...pruned.slice(at)]
  }

  return insert(pruned)
}

export function pruneTree(
  roots: TreeNode[],
  predicate: (record: DynamicRecord) => boolean,
): TreeNode[] {
  const visit = (node: TreeNode, parent: TreeNode | null): TreeNode | null => {
    const newChildren: TreeNode[] = []
    for (const c of node.children) {
      const next = visit(c, node)
      if (next) newChildren.push(next)
    }
    const selfMatches = predicate(node.record)
    if (!selfMatches && newChildren.length === 0) return null
    return {
      id: node.id,
      record: node.record,
      depth: node.depth,
      parent,
      children: newChildren,
    }
  }

  const out: TreeNode[] = []
  for (const r of roots) {
    const next = visit(r, null)
    if (next) out.push(next)
  }
  return out
}
