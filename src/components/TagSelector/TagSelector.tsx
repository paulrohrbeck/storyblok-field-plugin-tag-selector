import { useState, useEffect, useCallback } from 'react'
import './styles.css'

interface Tag {
  name: string
  taggings_count: number
}

interface TagSelectorProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  accessToken?: string
  startsWithFilter?: string
  version?: 'draft' | 'published'
}

const TagSelector = ({
  selectedTags,
  onTagsChange,
  accessToken,
  startsWithFilter,
  version = 'published',
}: TagSelectorProps) => {
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTags, setFilteredTags] = useState<Tag[]>([])

  const fetchTags = useCallback(async () => {
    if (!accessToken) return

    setIsLoading(true)
    setError(null)

    try {
      // Build query parameters
      const params = new URLSearchParams({
        token: accessToken,
        version: version,
        timestamp: Date.now().toString(), // Add timestamp to prevent caching
      })

      if (startsWithFilter) {
        params.append('starts_with', startsWithFilter)
      }

      const response = await fetch(
        `https://api.storyblok.com/v2/cdn/tags?${params.toString()}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
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
  }, [accessToken, startsWithFilter, version])

  useEffect(() => {
    if (accessToken) {
      fetchTags()
    }
  }, [accessToken, fetchTags])

  // Filter tags based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTags(tags)
    } else {
      const filtered = tags.filter((tag) =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredTags(filtered)
    }
  }, [tags, searchTerm])

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
      {/* Error Display */}
      {error && (
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
      )}

      {/* Configuration Notice */}
      {!accessToken && (
        <div className="config-notice">
          <p>Configure your Storyblok Access Token to load tags.</p>
        </div>
      )}

      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="selected-tags">
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

      {/* Tags List */}
      {isLoading ? (
        <div className="loading-state">
          <p>Loading tags...</p>
        </div>
      ) : tags.length === 0 ? (
        <div className="no-tags">No tags available</div>
      ) : (
        <div className="tag-options-list">
          <h3 className="available-tags-title">
            Available Tags ({filteredTags.length}):
          </h3>

          {/* Search Field */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="tag-options">
            {filteredTags.length === 0 ? (
              <div className="no-search-results">No matching tags found</div>
            ) : (
              filteredTags.map((tag, index) => (
                <label
                  key={`${tag.name}-${index}`}
                  className="tag-option"
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag.name)}
                    onChange={() => toggleTag(tag.name)}
                  />
                  <span className="tag-name">{tag.name}</span>
                  {tag.taggings_count > 0 && (
                    <span className="tag-count">({tag.taggings_count})</span>
                  )}
                </label>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default TagSelector
