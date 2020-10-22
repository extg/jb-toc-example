import React, { useState } from 'react';

import styles from './index.module.css';

const TocItemPage = ({ url, title, pages, anchors }) => {
 const [isOpen, setIsOpen] = useState(false)

 return (
   <div>
     <a onClick={() => setIsOpen(prev => !prev)}>{title}</a>
     {isOpen && anchors && (
       <div>
        {anchors.map(anchor => <TocItemAnchor key={anchor.id} {...anchor} />)}
      </div>
     )}
     {isOpen && pages && (
      <div>
         {pages.map(page => <TocItemPage key={page.id} {...page} />)}
      </div>
     )}
   </div>
 )
}

const TocItemAnchor = ({ title, url }) => {
  return (
    <a>
      {title}
    </a>
  )
}

const Toc = ({ tree }) => {
  return tree.map(page => <TocItemPage key={page.id} {...page} />)
}

export default Toc;
