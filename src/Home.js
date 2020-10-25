import React, { useState, useMemo } from 'react';
import useSWR from 'swr'
import axios from 'axios'
import Fuse from 'fuse.js'
import { useDebouncedCallback } from 'use-lodash-debounce'

import styles from './Home.module.css';
import Toc from './Toc';

const fetcher = (url) => axios.get(url).then(response => response.data)

const createTree = ({ entities, id, isOpen = false }) => {
  const page = entities.pages[id]

  return {
    id: page.id,
    isOpen,
    url: page.url,
    title: page.title,
    pages: page.pages?.map(pageId => createTree({ entities, id: pageId })),
    anchors: page.anchors?.map(anchorId => {
      const anchor = entities.anchors[anchorId]

      return {
        id: anchor.id,
        title: anchor.title,
        url: anchor.url + anchor.anchor,
      }
    })
  }
}

const Home = () => {
  const { data } = useSWR('/HelpTOC.json', fetcher)
  const [value, setValue] = useState('')

  const handleChange = useDebouncedCallback(event => console.log('event', event.target) || setValue(event.target.value), 10)

  if (!data) {
    return null
  }

  let tree = data.topLevelIds.map(id => createTree({ entities: data.entities, id }))

  const options = {
    keys: ['title'],
    threshold: 0,
  }

  if (value) {
    const pages = Object.values(data.entities.pages)
    const anchors = Object.values(data.entities.anchors)

    const pagesFuse = new Fuse(pages, options)
    const anchorsFuse = new Fuse(anchors, options)

    const resultPages = pagesFuse.search(value)
    const resultAnchors = anchorsFuse.search(value)

    tree = [ ...resultPages, ...resultAnchors]
      .map(({ item }) => item.anchor ? item.parentId : item.id)
      .filter((value, index, self) => self.indexOf(value) === index)
      .map(id => createTree({ entities: data.entities, id, isOpen: true }))
  }

  return (
    <div>
      <input
        type='text'
        className={styles.search}
        onChange={handleChange}
        placeholder='Search'
      />
      <Toc tree={tree} />
    </div>
  );
}

export default Home;
