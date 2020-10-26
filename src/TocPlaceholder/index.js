import React from 'react'

import styles from './index.module.css'

const TextLine = ({ children }) => (
  <div className={styles.textLine}>
    <span>
      {children}
    </span>
  </div>
)

const TocPlaceholder = () => {
  return (
    <div className={styles.root}>
      <TextLine>Install IntelliJ IDEA</TextLine>
      <TextLine>Getting started</TextLine>
      <TextLine>Configuring the IDE</TextLine>
      <TextLine>Configuring projects</TextLine>
      <TextLine>Working with source code</TextLine>
      <TextLine>Building, running, testing and deploying applications</TextLine>
      <TextLine>Analyzing applications</TextLine>
      <TextLine>Version control</TextLine>
      <TextLine>Big Data tools</TextLine>
      <TextLine>Scientific tools</TextLine>
      <TextLine>Advanced IDE Features</TextLine>
    </div>
  )
}

export default TocPlaceholder
