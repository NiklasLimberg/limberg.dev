import { findAfter } from 'unist-util-find-after';
import { visitParents } from 'unist-util-visit-parents';

const MAX_HEADING_DEPTH = 6;

function sectionize(node, ancestors) {
    const start = node;
    const depth = start.depth;

    const parent = ancestors[ancestors.length - 1];

    const isEnd = node => node.type === 'heading' && node.depth <= depth || node.type === 'export';
    const end = findAfter(parent, start, isEnd);

    const startIndex = parent.children.indexOf(start);
    const endIndex = parent.children.indexOf(end);

    const between = parent.children.slice(
        startIndex,
        endIndex > 0 ? endIndex : undefined,
    );

    const section = {
        type: 'section',
        depth: depth,
        children: between,
        data: {
            hName: 'section',
        },
    };

    parent.children.splice(startIndex, section.children.length, section);
}

function sectionizeHeader(node, ancestors) {
    const start = node;
    const depth = start.depth;

    const parent = ancestors[ancestors.length - 1];

    const isEnd = node => node.type === 'section' || node.type === 'export';
    const end = findAfter(parent, start, isEnd);

    const startIndex = parent.children.indexOf(start);
    const endIndex = parent.children.indexOf(end);

    const between = parent.children.slice(
        startIndex,
        endIndex > 0 ? endIndex : undefined,
    );

    const section = {
        type: 'header',
        depth: depth,
        children: between,
        data: {
            hName: 'header',
        },
    };

    parent.children.splice(startIndex, section.children.length, section);
}


function transform(tree) {
    for (let depth = MAX_HEADING_DEPTH; depth > 1; depth--) {
        visitParents(
            tree,
            node => node.type === 'heading' && node.depth === depth,
            sectionize,
        );
    }

    visitParents(
        tree,
        node => node.type === 'heading' && node.depth === 1,
        sectionizeHeader,
    );
}

export function remarkSections() {
    return transform;
}