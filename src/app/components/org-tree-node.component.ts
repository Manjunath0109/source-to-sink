import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgNode } from '../models/org-node.model';

@Component({
  selector: 'org-tree-node',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tree-node">
      <div 
        class="node-content"
        [class.highlighted]="node.highlighted"
        (click)="selectNode(node)">
        <span 
          *ngIf="node.children?.length" 
          class="expand-icon"
          (click)="toggleNode($event, node)">
          {{node.expanded ? '−' : '+'}}
        </span>
        <div class="node-info">
          <div class="node-name">{{node.name}}</div>
          <div class="node-title">{{node.title}}</div>
        </div>
      </div>
      
      <div class="tree-children" *ngIf="node.expanded && node.children?.length">
        <div class="tree-child" *ngFor="let child of node.children">
          <org-tree-node
            [node]="child"
            (nodeSelected)="onNodeSelected($event)">
          </org-tree-node>
        </div>
      </div>
    </div>
  `
})
export class OrgTreeNodeComponent {
  @Input() node!: OrgNode;
  @Output() nodeSelected = new EventEmitter<OrgNode>();

  toggleNode(event: Event, node: OrgNode) {
    event.stopPropagation();
    node.expanded = !node.expanded;
  }

  selectNode(node: OrgNode) {
    this.nodeSelected.emit(node);
  }

  onNodeSelected(node: OrgNode) {
    this.nodeSelected.emit(node);
  }
}