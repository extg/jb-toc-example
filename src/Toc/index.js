import React, { useState, useEffect, useCallback } from 'react';
import classnames from 'classnames/bind';
import { CSSTransition } from 'react-transition-group';

import styles from './index.module.css';
import transitions from './transitions.module.css';

const cx = classnames.bind(styles)

const levelStep = 16
const basePadding = 32
const iconSize = 14

// TODO: url не использую, т.к. нужно подключить ReactRouter
const TocItemPage = ({ url, title, pages, anchors, isOpen: initialState = false, level }) => {
  const [isOpen, setIsOpen] = useState(initialState)

  useEffect(() => {
    setIsOpen(initialState)
  }, [initialState])

  const handleClick = useCallback(() => setIsOpen(prev => !prev), [setIsOpen])

  const hasChildren = pages?.length > 0 || anchors?.length > 0

  const paddingLeft = basePadding + iconSize + levelStep * level

  return (
    <div className={cx('page', { isOpen, hasChildren })}>
      <a tabIndex={0} onClick={handleClick} style={{ paddingLeft }}>
        <span className={styles.text}>{title}</span>
      </a>
      <CSSTransition
        in={isOpen}
        timeout={200}
        classNames={transitions}
        unmountOnExit
        mountOnEnter
      >
        <div className={transitions.root}>
          {anchors?.map(anchor => <TocItemAnchor key={anchor.id} {...anchor} level={level + 1} />)}
          {pages?.map(page => <TocItemPage key={page.id} {...page} level={level + 1} />)}
        </div>
      </CSSTransition>
    </div>
  )
}

const TocItemAnchor = ({ title, url, level }) => {
  const paddingLeft = basePadding + iconSize + levelStep * level

  return (
    <a className={styles.anchor} style={{ paddingLeft }}>
      <span className={styles.text}>{title}</span>
    </a>
  )
}

// TODO: возможно стоило сделать плоским списком
const Toc = ({ tree = [] }) => {
  return (
    <div className={styles.tocWrapper}>
      {tree.map(page => <TocItemPage key={page.id} {...page} level={0} />)}
    </div>
  )
}

export default Toc;
