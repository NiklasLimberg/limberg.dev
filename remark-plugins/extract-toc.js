import Slugger from 'github-slugger';
import { visit } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';

const slugs = new Slugger();

function transform(tree, file) {
    const headings = [];

    slugs.reset();
    
    visit(
        tree,
        node => node.type === 'heading',
        (node) => {
            const text = toString(node);
            const slug = slugs.slug(text);

            node.data = {
                hProperties: {
                    id: slug,
                },
            };

            const textNode = node.children[0];
            node.children = [
                {
                    type: 'link',
                    url: `#${slug}`,
                    children: [textNode],
                },
            ];

            if (node.depth === 2) {
                headings.push({
                    text: text,
                    slug: slug,
                });
            }
        },
    );

    let yamlContent = '';
    
    const ymlNode = tree.children[0];
    const hasYaml = ymlNode.type === 'yaml';

    if (hasYaml) {
        yamlContent = ymlNode.value;
    }

    yamlContent += ` ${JSON.stringify(headings)}\n`;

    if (hasYaml) {
        ymlNode.value = yamlContent;
    } else {
        tree.children.unshift({
            type: 'yaml',
            value: yamlContent,
        });
    }

    file.data.fm.toc = headings;
}

export function buildToc() {
    return transform;
}