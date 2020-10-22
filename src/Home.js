import React from 'react';
import useSWR from 'swr'
import axios from 'axios'

import logo from './react.svg';
import styles from './Home.module.css';
import Toc from './Toc';

const fetcher = (url) => axios.get(url).then(response => response.data)

// const t = [
//   {
//     id,
//     url,
//     anchor,
//     title,
//     items: [
//       {
//         id,
//         url,
//         anchor,
//         title,
//         items: [

//         ]
//       }
//     ]
//   }
// ]

const createTree = ({ entities, id }) => {
  const page = entities.pages[id]

  return {
    id: page.id,
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

  console.log('data', data)

  if (!data) {
    return null
  }

  const tree = data.topLevelIds.map(id => createTree({ entities: data.entities, id }))

  console.log('tree', tree)

  return (
    <div className={styles.root}>
      <div className={styles.toc}>
        <nav>
          <Toc tree={tree} />
        </nav>
      </div>
      <main>
        hello
      </main>
    </div>
  );
}

export default Home;
