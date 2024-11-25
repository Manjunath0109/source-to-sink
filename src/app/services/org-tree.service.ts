import { Injectable } from '@angular/core';
import { OrgNode } from '../models/org-node.model';

@Injectable({
  providedIn: 'root'
})
export class OrgTreeService {
  private treeData: OrgNode[] = [];

  getInitialData(): OrgNode[] {
    // Sample data - replace with your actual data source
    return [
      {
        id: 1,
        name: 'CEO',
        title: 'Chief Executive Officer',
        children: [
          {
            id: 2,
            name: 'CTO',
            title: 'Chief Technology Officer',
            children: [
              {
                id: 4,
                name: 'Dev Lead',
                title: 'Development Lead',
                children: [
                  {
                    id: 7,
                    name: 'Developer 1',
                    title: 'Senior Developer'
                  },
                  {
                    id: 8,
                    name: 'Developer 2',
                    title: 'Junior Developer'
                  }
                ]
              }
            ]
          },
          {
            id: 3,
            name: 'CFO',
            title: 'Chief Financial Officer',
            children: [
              {
                id: 5,
                name: 'Finance Lead',
                title: 'Finance Team Lead',
                children: [
                  {
                    id: 9,
                    name: 'Accountant 1',
                    title: 'Senior Accountant'
                  },
                  {
                    id: 10,
                    name: 'Accountant 2',
                    title: 'Junior Accountant'
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
  }

  processTree(nodes: OrgNode[], parent?: OrgNode) {
    this.treeData = nodes;
    nodes.forEach(node => {
      node.parent = parent;
      if (node.children) {
        this.processTree(node.children, node);
      }
    });
  }

  getLeafNodes(nodes: OrgNode[]): OrgNode[] {
    const leaves: OrgNode[] = [];
    
    const findLeaves = (node: OrgNode) => {
      if (!node.children || node.children.length === 0) {
        leaves.push(node);
      } else {
        node.children.forEach(findLeaves);
      }
    };

    nodes.forEach(findLeaves);
    return leaves;
  }

  getPathToRoot(node: OrgNode): OrgNode[] {
    const path: OrgNode[] = [];
    let current = node.parent;
    
    while (current && current.parent) {
      path.push(current);
      current = current.parent;
    }
    
    return path;
  }

  highlightPath(node: OrgNode) {
    this.clearHighlights();
    
    node.highlighted = true;
    let current = node.parent;
    while (current) {
      current.highlighted = true;
      current = current.parent;
    }
  }

  private clearHighlights() {
    const clear = (node: OrgNode) => {
      node.highlighted = false;
      if (node.children) {
        node.children.forEach(clear);
      }
    };
    
    this.treeData.forEach(clear);
  }

  searchNodes(term: string): OrgNode[] {
    const searchTerm = term.toLowerCase();
    const results: OrgNode[] = [];
    
    const search = (node: OrgNode) => {
      if (node.name.toLowerCase().includes(searchTerm) ||
          node.title.toLowerCase().includes(searchTerm)) {
        results.push(node);
      }
      
      if (node.children) {
        node.children.forEach(search);
      }
    };
    
    this.treeData.forEach(search);
    return results;
  }
}