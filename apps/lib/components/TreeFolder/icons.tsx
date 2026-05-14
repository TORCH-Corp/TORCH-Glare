"use client"

import {
  Folder,
  FolderOpen,
  File,
  Frame,
  Group,
  Component,
  Box,
  Type,
  Image as ImageIcon,
  Spline,
  Link as LinkIcon,
  Square,
  LayoutGrid,
} from "lucide-react"
import type { ReactNode } from "react"
import type { TreeFolderIconResolver, TreeFolderNode } from "./types"

export const defaultIconRegistry: Record<
  string,
  (state: { isOpen: boolean }) => ReactNode
> = {
  folder: ({ isOpen }) =>
    isOpen ? <FolderOpen className="w-3.5 h-3.5" /> : <Folder className="w-3.5 h-3.5" />,
  file: () => <File className="w-3.5 h-3.5" />,
  frame: () => <Frame className="w-3.5 h-3.5" />,
  group: () => <Group className="w-3.5 h-3.5" />,
  component: () => <Component className="w-3.5 h-3.5" />,
  instance: () => <Box className="w-3.5 h-3.5" />,
  text: () => <Type className="w-3.5 h-3.5" />,
  image: () => <ImageIcon className="w-3.5 h-3.5" />,
  vector: () => <Spline className="w-3.5 h-3.5" />,
  link: () => <LinkIcon className="w-3.5 h-3.5" />,
  section: () => <LayoutGrid className="w-3.5 h-3.5" />,
  container: () => <Square className="w-3.5 h-3.5" />,
}

export function defaultIconFor(
  node: TreeFolderNode,
  state: { isOpen: boolean; isInternal: boolean; isSelected: boolean },
): ReactNode {
  if (node.icon !== undefined) return node.icon
  const type = node.type ?? (state.isInternal ? "folder" : "file")
  const resolver = defaultIconRegistry[type]
  if (resolver) return resolver({ isOpen: state.isOpen })
  return state.isInternal
    ? defaultIconRegistry.folder({ isOpen: state.isOpen })
    : defaultIconRegistry.file({ isOpen: state.isOpen })
}

export function resolveIcon(
  iconFor: TreeFolderIconResolver | undefined,
  node: TreeFolderNode,
  state: { isOpen: boolean; isInternal: boolean; isSelected: boolean },
): ReactNode {
  if (iconFor) {
    const custom = iconFor(node, state)
    if (custom !== undefined && custom !== null) return custom
  }
  return defaultIconFor(node, state)
}
