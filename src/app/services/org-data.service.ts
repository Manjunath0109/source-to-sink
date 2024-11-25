import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { OrgNode } from '../models/org-node.model';

@Injectable({
  providedIn: 'root'
})
export class OrgDataService {
  private pageSize = 5;
  private allData: OrgNode[] = this.generateLargeDataset();

  getInitialData(): Observable<OrgNode[]> {
    return of(this.allData.slice(0, 1)).pipe(delay(500));
  }

  getMoreData(offset: number): Observable<OrgNode[]> {
    const nextBatch = this.allData.slice(offset, offset + this.pageSize);
    return of(nextBatch).pipe(delay(500));
  }

  searchNodes(term: string): Observable<OrgNode[]> {
    const results = this.searchInNodes(this.allData, term.toLowerCase());
    return of(results).pipe(delay(300));
  }

  private searchInNodes(nodes: OrgNode[], term: string): OrgNode[] {
    return nodes.reduce((acc: OrgNode[], node) => {
      const nodeMatches = 
        node.name.toLowerCase().includes(term) ||
        node.title.toLowerCase().includes(term);

      if (nodeMatches) {
        acc.push({ ...node, children: node.children ? this.searchInNodes(node.children, term) : [] });
      } else if (node.children) {
        const matchingChildren = this.searchInNodes(node.children, term);
        if (matchingChildren.length > 0) {
          acc.push({ ...node, children: matchingChildren });
        }
      }
      return acc;
    }, []);
  }

  private generateLargeDataset(): OrgNode[] {
    const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
    const positions = ['Director', 'Manager', 'Lead', 'Senior', 'Junior'];
    
    const rootNode: OrgNode = {
      id: 1,
      name: 'John Smith',
      title: 'CEO',
      expanded: true,
      children: []
    };

    departments.forEach((dept, deptIndex) => {
      const deptHead: OrgNode = {
        id: (deptIndex + 1) * 10,
        name: `${dept} Director`,
        title: `${dept} Department Head`,
        children: []
      };

      positions.forEach((pos, posIndex) => {
        if (pos !== 'Director') {
          const manager: OrgNode = {
            id: (deptIndex + 1) * 100 + posIndex,
            name: `${dept} ${pos}`,
            title: `${pos} of ${dept}`,
            children: []
          };

          // Add team members
          for (let i = 1; i <= 3; i++) {
            manager.children!.push({
              id: (deptIndex + 1) * 1000 + posIndex * 10 + i,
              name: `${dept} Team Member ${i}`,
              title: `${dept} ${pos} Associate`,
              children: []
            });
          }

          deptHead.children!.push(manager);
        }
      });

      rootNode.children!.push(deptHead);
    });

    return [rootNode];
  }
}