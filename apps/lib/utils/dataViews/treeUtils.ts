import type { DynamicRecord, TreeConfig } from "../../components/DataViews/types"
import { getByPath } from "./pathUtils"

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
