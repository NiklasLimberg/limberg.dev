import Slugger from 'github-slugger';
import { visit } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';

const slugs = new Slugger();

export default function headlineConvert() {
    return (tree) => {
        slugs.reset();
  
        visit(tree, 'element', (node) => {
            if (['h1', 'h2', 'h3', 'h4', 'h5'].includes(node.tagName)) {
                node.properties.id  = slugs.slug(toString(node));
            }
        });
    };
}