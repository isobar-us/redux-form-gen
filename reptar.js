import docs from 'documentation';
import decamelize from 'decamelize';
import fs from 'fs';
import path from 'path';

const slug = (name) => decamelize(name, '-');
const mdLink = (name) => `#${name.toLowerCase()}`;
const slugLink = (name) => `${slug(name)}.md`;

docs
  .build('./src/**.js', {
    shallow: true
  })
  .then((raw) => {
    const items = raw
      .map((item) => {
        return {
          ...item,
          slug: slug(item.name),
          slugLink: slugLink(item.name),
          mdLink: mdLink(item.name)
        };
      })
      .map((item) => {
        return {
          ...item,
          header: `---
id: ${item.slug}
title: ${item.name}
sidebar_label: ${item.name}
---`
        };
      });
    docs.formats.md(raw).then((md) => {
      md = md.replace(/\nType: .*\n/g, '');
      items.map((item) => {
        md = md.replace(new RegExp(item.mdLink, 'g'), item.slugLink);
      });
      // for (let i = 0; i < items.length; i++) {
      //   const item = items[i];
      //   console.log(item.mdLink, item.slugLink);
      //   md = md.replace(new RegExp(item.mdLink, 'g'), item.slugLink);
      // }
      const mdItems = md.match(/\n(## [\S\s]+?)(?=\n##\s|$)/g);

      // console.log(md);
      // console.log(mdItems);
      // console.log(md.split(/\n## /g));
      items.map((item, index) => {
        const mdItem = mdItems[index];

        fs.writeFileSync(path.join(__dirname, '/docs', item.slugLink), `${item.header}${mdItem}`);
      });
    });

    docs.formats.json(raw).then((json) => {
      console.log(json);
    });
  });
