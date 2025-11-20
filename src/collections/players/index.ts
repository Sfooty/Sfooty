import type { CollectionConfig } from 'payload'

import {
  lexicalEditor,
  HeadingFeature,
  BlocksFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPathPlayer'
import { revalidateDelete, revalidatePlayer } from './hooks/revalidatePlayers'
import { populateAuthors } from '../populateAuthors'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from '@/fields/slug/indexPlayers'

export const Players: CollectionConfig = {
  slug: 'players',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    name: true,
    slug: true,
    date_of_birth: true,
  },
  admin: {
    defaultColumns: ['name', 'slug', 'team', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'players',
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'players',
        req,
      }),
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    // {
    //     name: 'slug',
    //     type: 'text',
    //     required: true,
    // },
    {
      name: 'date_of_birth',
      type: 'date',
      required: true,
    },
    {
      name: 'height',
      type: 'number',
      label: 'Height in meters',
      required: true,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'weight',
      type: 'number',
      label: 'Weight in Kg',
      required: true,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'position',
      type: 'text',
      required: true,
    },
    {
      name: 'shirt_number',
      label: 'Jersey Number',
      type: 'number',
      required: true,
    },
    // {
    //   name: 'team',
    //   label: 'club',
    //   type: 'relationship',
    //   relationTo: 'clubs',
    //   required: true,
    //   index: true,
    // },
    {
      name: 'country',
      label: 'Country',
      type: 'text',
      required: true,
    },
    {
      name: 'bio',
      type: 'richText',
      editor: lexicalEditor({
        features: [
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          BlocksFeature({ blocks: [MediaBlock] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.name',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.name',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'populatedAuthors',
      type: 'array',
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePlayer],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
}
