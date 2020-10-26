import React, { useState, useMemo } from 'react';
import useSWR from 'swr'
import axios from 'axios'
import Fuse from 'fuse.js'
import { useDebouncedCallback } from 'use-lodash-debounce'
import clone from 'lodash.clonedeep'

import styles from './Home.module.css'
import Toc from './Toc';
import TocPlaceholder from './TocPlaceholder';

// for dev
const FAKE_LOADING_TIMEOUT = process.env.NODE_ENV === 'production' ? 0 : 2000

const fetcher = (url) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      axios.get(url)
        .then(response => response.data || ({
          ...response.data,
          timestamp: Date.now(),
        }))
        .then(resolve, reject)
    }, FAKE_LOADING_TIMEOUT);
  })
}

const createTree = ({ entities, id }) => {
  const page = entities.pages[id]

  if (!page) {
    return null
  }

  return {
    id: page.id,
    isOpen: page.isOpen || false,
    url: page.url,
    title: page.title,
    pages: page.pages?.reduce((acc, pageId) => {
      const childPage = createTree({ entities, id: pageId })

      return childPage ? [...acc, childPage] : acc
    }, []),
    anchors: page.anchors?.map((anchorId) => {
      const anchor = entities.anchors[anchorId]

      return {
        id: anchor.id,
        title: anchor.title,
        url: anchor.url + anchor.anchor,
      }
    })
  }
}

const useTocTree = (
  data,
  value
) => {
  const entities = data?.entities || {}
  const topLevelIds = data?.topLevelIds || []

  const fuse = useMemo(() => {
    const list = [
      ...entities.pages ? Object.values(entities.pages) : [],
      ...entities.anchors ? Object.values(entities.anchors) : [],
    ]

    return new Fuse(list, { keys: ['title'], threshold: 0 })
  }, [data])

  return useMemo(() => {
    if (!data) {
      return null
    }
    if (!value) {
      return topLevelIds.map(id => createTree({ entities, id }))
    }

    const resultEntities = clone(entities)
    const result = fuse.search(value)

    const resolveParentId = (item) => {
      if (item.parentId) {
        const parentPage = resultEntities.pages[item.parentId]

        // Нам нужно показывать только найденные подстраницу в дереве
        // поэтому проходимся по страницам наверх и оставляем только нужные
        if (parentPage.isOpen) {
          if (item.anchor && parentPage.anchors && !parentPage.anchors.includes(item.id)) {
            parentPage.anchors.push(item.id)
          }
          if (parentPage.pages && !parentPage.pages.includes(item.id)) {
            parentPage.pages.push(item.id)
          }
        } else {
          parentPage.isOpen = true

          if (item.anchor) {
            parentPage.pages = []
            parentPage.anchors = [item.id]
          } else {
            parentPage.pages = [item.id]
            parentPage.anchors = []
          }
        }

        if (parentPage.parentId) {
          return resolveParentId(parentPage)
        }

        return item.parentId
      }

      return item.id
    }

    const resultIds = result.reduce((acc, { item }) => {
      // attention resolveParentId mutates entities!
      const parentId = resolveParentId(item)

      if (!acc.includes(parentId)) {
        return [ ...acc, parentId ]
      }

      return acc
    }, [])


    const topIds = topLevelIds.filter(id => resultIds.includes(id))

    return topIds.map(id => createTree({ entities: resultEntities, id }))
  }, [value, data])
}

const Home = () => {
  const { data } = useSWR('/HelpTOC.json', fetcher)
  const [value, setValue] = useState('')

  const handleChange = useDebouncedCallback(
    event => setValue(event.target.value),
    500
  )

  const tree = useTocTree(data, value)

  return (
    <div className={styles.root}>
      <input
        type='text'
        className={styles.search}
        onChange={handleChange}
        placeholder='Search'
      />
      {!tree && <TocPlaceholder />}
      {tree && <Toc tree={tree} />}
    </div>
  );
}

export default Home;
