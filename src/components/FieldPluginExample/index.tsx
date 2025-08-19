import './example.css'
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
  const spaceId = data.options?.spaceId
  const accessToken = data.options?.accessToken

  return (
    <div className="container">
      <TagSelector
        selectedTags={data.content || []}
        onTagsChange={handleTagsChange}
        spaceId={spaceId}
        accessToken={accessToken}
      />
    </div>
  )
}

export default FieldPlugin
