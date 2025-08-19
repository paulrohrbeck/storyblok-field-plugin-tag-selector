import { useState, useEffect, useCallback } from 'react'

interface Tag {
  id: number
  name: string
}

interface TagSelectorProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  spaceId?: string
  accessToken?: string
}

const TagSelector = ({
  selectedTags,
  onTagsChange,
  spaceId,
  accessToken,
}: TagSelectorProps) => {
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const fetchTags = useCallback(async () => {
    if (!spaceId || !accessToken) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://mapi.storyblok.com/v1/spaces/${spaceId}/tags/`,
        {
          headers: {
            Authorization: accessToken,
            'Content-Type': 'application/json',
          },
        },
      )

      if (!response.ok) {
        throw new Error(
          `Failed to fetch tags: ${response.status} ${response.statusText}`,
        )
      }

      const data = await response.json()
      setTags(data.tags || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tags')
      console.error('Error fetching tags:', err)
    } finally {
      setIsLoading(false)
    }
  }, [spaceId, accessToken])

  useEffect(() => {
    if (spaceId && accessToken) {
      fetchTags()
    }
  }, [spaceId, accessToken, fetchTags])

  const toggleTag = (tagName: string) => {
    const newSelectedTags = selectedTags.includes(tagName)
      ? selectedTags.filter((tag) => tag !== tagName)
      : [...selectedTags, tagName]

    onTagsChange(newSelectedTags)
  }

  const removeTag = (tagName: string) => {
    onTagsChange(selectedTags.filter((tag) => tag !== tagName))
  }

  return (
    <div className="tag-selector">
      <h2>Tag Selector</h2>

      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="selected-tags">
          <h3>Selected Tags:</h3>
          <div className="tag-list">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="tag-badge"
              >
                {tag}
                <button
                  type="button"
                  className="tag-remove"
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove ${tag} tag`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Dropdown */}
      <div className="dropdown-container">
        <button
          type="button"
          className="dropdown-trigger btn w-full"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={isLoading}
        >
          {isLoading ? 'Loading tags...' : 'Select Tags'}
          <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>
            ▼
          </span>
        </button>

        {isDropdownOpen && (
          <div className="dropdown-menu">
            {error ? (
              <div className="error-message">
                <p>{error}</p>
                <button
                  type="button"
                  className="btn btn-small"
                  onClick={() => fetchTags()}
                >
                  Retry
                </button>
              </div>
            ) : tags.length === 0 ? (
              <div className="no-tags">
                {isLoading ? 'Loading...' : 'No tags available'}
              </div>
            ) : (
              <div className="tag-options">
                {tags.map((tag) => (
                  <label
                    key={tag.id}
                    className="tag-option"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.name)}
                      onChange={() => toggleTag(tag.name)}
                    />
                    <span className="checkmark"></span>
                    {tag.name}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Configuration Helper */}
      {(!spaceId || !accessToken) && (
        <div className="config-notice">
          <p>
            Configure your Storyblok Space ID and Access Token to load tags.
          </p>
        </div>
      )}
    </div>
  )
}

export default TagSelector
