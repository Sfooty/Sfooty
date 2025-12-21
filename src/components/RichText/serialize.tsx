import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import React, { Fragment, JSX } from 'react'
import { CMSLink } from '@/components/Link'
import { DefaultNodeTypes, SerializedBlockNode } from '@payloadcms/richtext-lexical'
import type { BannerBlock as BannerBlockProps } from '@/payload-types'
import {
  IS_BOLD,
  IS_CODE,
  IS_ITALIC,
  IS_STRIKETHROUGH,
  IS_SUBSCRIPT,
  IS_SUPERSCRIPT,
  IS_UNDERLINE,
} from './nodeFormat'
import type {
  CallToActionBlock as CTABlockProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'

export type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CTABlockProps | MediaBlockProps | BannerBlockProps | CodeBlockProps>

type Props = {
  nodes: NodeTypes[]
}

export function serializeLexical({ nodes }: Props): JSX.Element {
  return (
    <Fragment>
      {nodes?.map((node, index): JSX.Element | null => {
        if (!node) return null

        // Handle text nodes
        if (node.type === 'text') {
          let text = <>{node.text}</>
          if (node.format & IS_BOLD) text = <strong>{text}</strong>
          if (node.format & IS_ITALIC) text = <em>{text}</em>
          if (node.format & IS_STRIKETHROUGH)
            text = <span style={{ textDecoration: 'line-through' }}>{text}</span>
          if (node.format & IS_UNDERLINE)
            text = <span style={{ textDecoration: 'underline' }}>{text}</span>
          if (node.format & IS_CODE) text = <code>{node.text}</code>
          if (node.format & IS_SUBSCRIPT) text = <sub>{text}</sub>
          if (node.format & IS_SUPERSCRIPT) text = <sup>{text}</sup>

          return <React.Fragment key={index}>{text}</React.Fragment>
        }

        // Helper to serialize children safely
        const serializedChildrenFn = (childNode: NodeTypes): JSX.Element | null => {
          if ('children' in childNode && Array.isArray(childNode.children) && childNode.children.length > 0) {
            if (childNode.type === 'list' && childNode.listType === 'check') {
              childNode.children.forEach((item) => {
                if ('checked' in item && item.checked === undefined) {
                  item.checked = false
                }
              })
            }
            return serializeLexical({ nodes: childNode.children as NodeTypes[] })
          }
          return null
        }

        const serializedChildren = 'children' in node ? serializedChildrenFn(node) : null

        // Handle block nodes
        if (node.type === 'block') {
          const block = node.fields
          const blockType = block?.blockType
          if (!block || !blockType) return null

          switch (blockType) {
            case 'cta':
              return <CallToActionBlock key={index} {...block} />
            case 'mediaBlock':
              return (
                <MediaBlock
                  className="col-start-1 col-span-3"
                  imgClassName="m-0"
                  key={index}
                  {...block}
                  captionClassName="mx-auto max-w-[48rem]"
                  enableGutter={false}
                  disableInnerContainer={true}
                />
              )
            case 'banner':
              return <BannerBlock className="col-start-2 mb-4" key={index} {...block} />
            case 'code':
              return <CodeBlock className="col-start-2" key={index} {...block} />
            default:
              return null
          }
        }

        // Handle other node types
        switch (node.type) {
          case 'linebreak':
            return <br className="col-start-2" key={index} />
          case 'paragraph':
            return <p className="col-start-2" key={index}>{serializedChildren}</p>
          case 'heading': {
            const Tag = node?.tag || 'h2'
            return <Tag className="col-start-2" key={index}>{serializedChildren}</Tag>
          }
          case 'list': {
            const Tag = node?.tag || 'ul'
            return <Tag className="list col-start-2" key={index}>{serializedChildren}</Tag>
          }
          case 'listitem': {
            const liProps: any = node?.checked != null ? {
              'aria-checked': node.checked ? 'true' : 'false',
              role: 'checkbox',
              tabIndex: -1,
              value: node?.value,
            } : { value: node?.value }

            return <li key={index} {...liProps}>{serializedChildren}</li>
          }
          case 'quote':
            return <blockquote className="col-start-2" key={index}>{serializedChildren}</blockquote>
          case 'link': {
            const fields = node.fields
            return (
              <CMSLink
                key={index}
                newTab={Boolean(fields?.newTab)}
                reference={fields?.doc as any}
                type={fields?.linkType === 'internal' ? 'reference' : 'custom'}
                url={fields?.url}
              >
                {serializedChildren}
              </CMSLink>
            )
          }
          default:
            return null
        }
      })}
    </Fragment>
  )
}
