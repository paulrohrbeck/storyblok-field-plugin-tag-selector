import './styles.css'
import TagSelector from './TagSelector'
import { FunctionComponent } from 'react'
import { useFieldPlugin } from '@storyblok/field-plugin/react'

const FieldPlugin: FunctionComponent = () => {
  const { type, data, actions } = useFieldPlugin({
    enablePortalModal: true,
    validateContent: (content: unknown) => ({
      content: Array.isArray(content) ? content : [],
    }),
  })

  if (type !== 'loaded') {
    return null
  }

  const handleTagsChange = (tags: string[]) => {
    actions.setContent(tags)
  }

  // Extract configuration from field options
  const accessToken = data.token || data.options?.token
  const startsWithFilter = data.options?.startsWithFilter
  const version = data.options?.version || 'published'

  return (
    <div className="container">
      <TagSelector
        selectedTags={data.content || []}
        onTagsChange={handleTagsChange}
        accessToken={accessToken}
        startsWithFilter={startsWithFilter}
        version={version as 'draft' | 'published'}
      />
    </div>
  )
}

export default FieldPlugin
