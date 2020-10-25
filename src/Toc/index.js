import React, { useState } from 'react';
import classnames from 'classnames/bind';

import styles from './index.module.css';

const cx = classnames.bind(styles)

// TODO: url не использую, т.к. нужно подключить ReactRouter
const TocItemPage = ({ url, title, pages, anchors, isOpen: initialState = false }) => {
  const [isOpen, setIsOpen] = useState(initialState)

  const hasChildren = pages?.length > 0 || anchors?.length > 0

  return (
    <div className={cx('page', { isOpen, hasChildren })}>
      <a tabIndex={0} onClick={() => setIsOpen(prev => !prev)}>{title}</a>
      {isOpen && anchors && (
        <div className={styles.anchors}>
          {anchors.map(anchor => <TocItemAnchor key={anchor.id} {...anchor} />)}
        </div>
      )}
      {isOpen && pages && (
        <div className={styles.pages}>
          {pages.map(page => <TocItemPage key={page.id} {...page} />)}
        </div>
      )}
    </div>
  )
}

const TocItemAnchor = ({ title, url }) => {
  return (
    <a className={styles.anchor}>
      {title}
    </a>
  )
}

const Toc = ({ tree }) => {
  return (
    <div className={styles.tocWrapper}>
      {tree.map(page => <TocItemPage key={page.id} {...page} />)}
    </div>
  )
}

export default Toc;
