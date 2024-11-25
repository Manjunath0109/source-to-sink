import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrgTreeNodeComponent } from './app/components/org-tree-node.component';
import { OrgNode } from './app/models/org-node.model';
import { initialOrgData } from './app/data/org-data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, OrgTreeNodeComponent],
  template: `
    <div class="org-tree">
      <div class="search-container">
        <input
          type="text"
          class="search-input"
          [(ngModel)]="searchTerm"
          (input)="searchNodes()"
          placeholder="Search by name or title...">
      </div>
      <div class="tree">
        <org-tree-node
          *ngFor="let node of orgData"
          [node]="node"
          (nodeSelected)="highlightHierarchy($event)">
        </org-tree-node>
      </div>
    </div>
  `
})
export class App {
  searchTerm = '';
  orgData: OrgNode[] = initialOrgData;
  private originalData: OrgNode[] = JSON.parse(JSON.stringify(initialOrgData));

  constructor() {
    this.setupParentReferences(this.orgData);
    this.setupParentReferences(this.originalData);
  }

  private setupParentReferences(nodes: OrgNode[], parent?: OrgNode) {
    nodes.forEach(node => {
      node.parent = parent;
      if (node.children) {
        this.setupParentReferences(node.children, node);
      }
    });
  }

  highlightHierarchy(selectedNode: OrgNode) {
    this.clearHighlights(this.orgData);
    
    selectedNode.highlighted = true;
    
    let parent = selectedNode.parent;
    while (parent) {
      parent.highlighted = true;
      parent.expanded = true;
      parent = parent.parent;
    }
    
    if (selectedNode.children) {
      this.highlightChildren(selectedNode.children);
    }
  }

  private highlightChildren(nodes: OrgNode[]) {
    nodes.forEach(node => {
      node.highlighted = true;
      if (node.children) {
        this.highlightChildren(node.children);
      }
    });
  }

  private clearHighlights(nodes: OrgNode[]) {
    nodes.forEach(node => {
      node.highlighted = false;
      if (node.children) {
        this.clearHighlights(node.children);
      }
    });
  }

  searchNodes() {
    if (!this.searchTerm.trim()) {
      this.orgData = JSON.parse(JSON.stringify(this.originalData));
      this.setupParentReferences(this.orgData);
      return;
    }

    const searchTerm = this.searchTerm.toLowerCase();
    this.orgData = this.filterNodes(JSON.parse(JSON.stringify(this.originalData)), searchTerm);
    this.setupParentReferences(this.orgData);
  }

  private filterNodes(nodes: OrgNode[], searchTerm: string): OrgNode[] {
    return nodes.filter(node => {
      const matchesSearch = 
        node.name.toLowerCase().includes(searchTerm) ||
        node.title.toLowerCase().includes(searchTerm);

      if (node.children) {
        node.children = this.filterNodes(node.children, searchTerm);
        return matchesSearch || node.children.length > 0;
      }

      return matchesSearch;
    });
  }
}

bootstrapApplication(App, {
  providers: []
});