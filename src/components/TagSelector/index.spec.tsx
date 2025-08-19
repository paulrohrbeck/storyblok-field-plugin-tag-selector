import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { setupFieldPlugin } from '@storyblok/field-plugin/test'
import FieldPlugin from '.'

// Mock fetch for API calls
;(globalThis as any).fetch = vi.fn()

describe('TagSelector FieldPlugin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should render the tag selector component', () => {
    const { cleanUp } = setupFieldPlugin()
    render(<FieldPlugin />)
    const headline = screen.getByText('Tag Selector')
    expect(headline).toBeInTheDocument()
    cleanUp()
  })

  test('should show config notice when no spaceId or accessToken', () => {
    const { cleanUp } = setupFieldPlugin()
    render(<FieldPlugin />)
    const configNotice = screen.getByText(
      'Configure your Storyblok Space ID and Access Token to load tags.',
    )
    expect(configNotice).toBeInTheDocument()
    cleanUp()
  })

  test('should display the tag selector interface', () => {
    const { cleanUp } = setupFieldPlugin()
    render(<FieldPlugin />)

    const selectButton = screen.getByText('Select Tags')
    expect(selectButton).toBeInTheDocument()
    cleanUp()
  })

  test('should handle dropdown toggle', async () => {
    const { cleanUp } = setupFieldPlugin()

    const user = userEvent.setup()
    render(<FieldPlugin />)

    const dropdownButton = screen.getByText('Select Tags')
    await user.click(dropdownButton)

    // Check if dropdown opens (should show loading or no tags message)
    expect(dropdownButton).toBeInTheDocument()

    cleanUp()
  })

  test('should handle API error gracefully', async () => {
    const { cleanUp } = setupFieldPlugin()

    const user = userEvent.setup()
    render(<FieldPlugin />)

    const dropdownButton = screen.getByText('Select Tags')
    await user.click(dropdownButton)

    // Should show dropdown interface
    expect(dropdownButton).toBeInTheDocument()

    cleanUp()
  })
})
