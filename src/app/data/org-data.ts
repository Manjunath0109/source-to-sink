import { OrgNode } from '../models/org-node.model';

export const initialOrgData: OrgNode[] = [
  {
    id: 1,
    name: 'John Doe',
    title: 'CEO',
    expanded: true,
    children: [
      {
        id: 2,
        name: 'Jane Smith',
        title: 'CTO',
        expanded: true,
        children: [
          {
            id: 4,
            name: 'Bob Wilson',
            title: 'Tech Lead',
            children: [
              {
                id: 7,
                name: 'Alice Johnson',
                title: 'Senior Developer'
              },
              {
                id: 8,
                name: 'Charlie Brown',
                title: 'Developer'
              }
            ]
          },
          {
            id: 5,
            name: 'Carol White',
            title: 'QA Lead'
          }
        ]
      },
      {
        id: 3,
        name: 'Mike Johnson',
        title: 'CFO',
        expanded: true,
        children: [
          {
            id: 6,
            name: 'Sarah Davis',
            title: 'Financial Controller',
            children: [
              {
                id: 9,
                name: 'Tom Harris',
                title: 'Senior Accountant'
              },
              {
                id: 10,
                name: 'Emma Wilson',
                title: 'Financial Analyst'
              }
            ]
          }
        ]
      }
    ]
  }
];