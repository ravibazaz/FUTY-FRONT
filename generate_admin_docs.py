#!/usr/bin/env python3
import os
from pathlib import Path
import re

def extract_imports(file_content):
    """Extract imports from file"""
    imports = []
    for line in file_content.split('\n'):
        if line.strip().startswith('import ') or line.strip().startswith('from '):
            imports.append(line.strip())
    return imports

def get_dependencies(content):
    """Parse content to identify key dependencies"""
    deps = []
    if 'useState' in content or 'useEffect' in content or 'useRouter' in content:
        deps.append('React Hooks')
    if 'next/link' in content:
        deps.append('next/link')
    if 'next/navigation' in content:
        deps.append('next/navigation')
    if 'next/image' in content:
        deps.append('next/image')
    if 'sweetalert2' in content or 'Swal' in content:
        deps.append('SweetAlert2')
    if 'zod' in content or 'z.object' in content:
        deps.append('Zod')
    if 'connectDB' in content or 'mongoose' in content:
        deps.append('Mongoose/Database')
    if 'bcryptjs' in content:
        deps.append('bcryptjs')
    if 'uuid' in content:
        deps.append('UUID')
    if '@/components' in content:
        deps.append('React Components')
    if '@/actions' in content:
        deps.append('Server Actions')
    return deps

root = Path('app/admin')
doc_root = Path('doc/app/admin')

for path in sorted(root.rglob('*')):
    if path.is_file() and path.suffix in {'.js', '.jsx'}:
        try:
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            rel = path.relative_to(root)
            doc_file = doc_root / rel.with_suffix(rel.suffix + '.md')
            doc_file.parent.mkdir(parents=True, exist_ok=True)
            
            parts = rel.parts
            name = path.stem
            is_client = '"use client"' in content
            is_server = '"use server"' in content or 'connectDB' in content or 'async' in content
            
            # Determine route type
            if name == 'layout':
                route_type = 'Layout Component'
                purpose = 'Shared layout wrapper for all admin routes'
            elif name == 'loading':
                route_type = 'Loading Component'
                purpose = 'Loading UI for route segments'
            elif name == 'page':
                if 'new' in parts:
                    route_type = 'Creation Page'
                    purpose = f'Create new {parts[0]} entries'
                elif 'edit' in parts:
                    route_type = 'Edit Page'
                    purpose = f'Edit existing {parts[0]} records'
                elif 'view' in parts:
                    route_type = 'Detail View Page'
                    purpose = f'View individual {parts[0]} records'
                elif len(parts) == 1:
                    route_type = 'List/Dashboard Page'
                    purpose = f'{parts[0].title()} management dashboard'
                else:
                    route_type = 'Page Route'
                    purpose = 'Admin page route'
            elif 'Actions' in name or name.endswith('Actions'):
                route_type = 'Server Action'
                purpose = f'Backend logic and database operations for {parts[0] if parts else "admin"}'
            else:
                route_type = 'Helper/Utility File'
                purpose = 'Helper logic for admin routes'
            
            # Build documentation
            lines = [
                f'# Admin {route_type}: {" ".join([p.replace("[id]", "ID").replace("-", " ").title() for p in parts[:-1] if p])}',
                '',
                '## Purpose & Responsibility',
                '',
                purpose,
                ''
            ]
            
            if is_server and name != 'layout':
                lines.append('**Key Responsibility:** Provide server-side processing, database operations, and API integration.')
                lines.append('')
            elif is_client and name != 'layout':
                lines.append('**Key Responsibility:** Render interactive UI with state management and user interactions.')
                lines.append('')
            
            lines.extend(['---', ''])
            
            # Overview table
            lines.extend([
                '## Overview',
                '',
                '| Aspect | Details |',
                '|--------|---------|',
                f'| **File Location** | `app/admin/{rel.as_posix()}` |',
                f'| **Component Type** | {"Server Component" if is_server else "Client Component"} |',
                f'| **Route Type** | {route_type} |',
                f'| **Framework** | Next.js App Router |',
            ])
            
            if is_client:
                lines.append('| **Client-side** | Yes (`"use client"`) |')
            if is_server:
                lines.append('| **Server-side** | Yes |')
            
            lines.extend([
                '| **Styling** | Bootstrap CSS classes |',
                '',
            ])
            
            # Key Features
            lines.extend(['## Key Features & Capabilities', ''])
            
            features = []
            if is_client:
                features.extend([
                    '- Client-side React component with interactive UI',
                    '- Manages local state and side effects with React Hooks',
                    '- Responsive Bootstrap design',
                ])
            if is_server and name != 'layout':
                features.extend([
                    '- Server-side processing with Next.js server capabilities',
                    '- Database operations via Mongoose ORM',
                    '- Authentication and authorization via HTTP cookies',
                ])
            if 'DataTable' in content or '#example' in content:
                features.extend([
                    '- DataTables integration for dynamic tabular data',
                    '- Search, filter, sort, and pagination functionality',
                ])
            if 'Swal' in content or 'sweetalert2' in content:
                features.extend([
                    '- SweetAlert2 notifications and confirmations',
                    '- Toast messages for operation feedback',
                ])
            if 'fetch' in content and is_client:
                features.extend([
                    '- Client-side API calls to backend routes',
                    '- Real-time data fetching and rendering',
                    '- Error handling for API failures',
                ])
            if 'form' in name.lower() or 'Form' in content or 'formData' in content:
                features.extend([
                    '- Form handling with client and server validation',
                    '- Error feedback and success notifications',
                ])
            if 'redirect' in content:
                features.extend([
                    '- Server-side redirects after operations',
                    '- Protected route with authentication checks',
                ])
            if 'DeleteButton' in content or 'delete' in content.lower():
                features.extend([
                    '- Safe delete operations with confirmations',
                    '- Server-side delete actions',
                ])
            if name == 'layout':
                features.extend([
                    '- Wraps all admin routes with shared layout',
                    '- Provides Header and Sidebar navigation',
                    '- Maintains consistent admin UI structure',
                ])
            if name == 'loading':
                features.extend([
                    '- Shows loading indicator during route transitions',
                    '- Improves perceived performance',
                ])
            
            for feature in features:
                lines.append(feature)
            
            # Dependencies
            deps = get_dependencies(content)
            if deps:
                lines.extend(['', '## Dependencies', ''])
                lines.extend([
                    '| Dependency | Purpose |',
                    '|---|---|',
                ])
                
                seen = set()
                for dep in sorted(set(deps)):
                    if dep not in seen:
                        if 'React' in dep:
                            lines.append('| React Hooks | State and side-effect management |')
                        elif 'next/link' in dep:
                            lines.append('| `next/link` | Client-side navigation and routing |')
                        elif 'next/navigation' in dep:
                            lines.append('| `next/navigation` | Router and navigation utilities |')
                        elif 'SweetAlert2' in dep:
                            lines.append('| SweetAlert2 | Notifications, confirmations, and toasts |')
                        elif 'Zod' in dep:
                            lines.append('| Zod | Schema validation and error handling |')
                        elif 'Mongoose' in dep:
                            lines.append('| Mongoose | Database ORM and models |')
                        elif 'Server Actions' in dep:
                            lines.append('| Server Actions | Backend form handling and operations |')
                        elif 'React Components' in dep:
                            lines.append('| React Components | Reusable UI components |')
                        elif 'bcryptjs' in dep:
                            lines.append('| bcryptjs | Secure password hashing |')
                        elif 'UUID' in dep:
                            lines.append('| uuid | Unique identifier generation |')
                        seen.add(dep)
            
            # Code Structure
            imports = extract_imports(content)
            if imports:
                lines.extend(['', '## Code Structure & Imports', ''])
                lines.append('```javascript')
                for imp in imports[:12]:
                    lines.append(imp)
                if len(imports) > 12:
                    lines.append(f'// ... and {len(imports) - 12} more imports')
                lines.append('```')
            
            # Implementation Details
            lines.extend(['', '## Implementation Details', ''])
            
            if is_server and name != 'layout' and name != 'loading':
                lines.append('**Server-side Processing:**')
                lines.extend([
                    '- Database connection via `connectDB()`',
                    '- Authentication using cookies',
                    '- Data validation and sanitization',
                    '- Server-side redirects on success',
                    ''
                ])
            
            if is_client and 'useState' in content:
                lines.append('**State Management:**')
                lines.extend([
                    '- Local component state with `useState`',
                    '- Side effects with `useEffect`',
                    '- Client-side data fetching from API routes',
                    ''
                ])
            
            if 'useActionState' in content or 'useFormState' in content:
                lines.append('**Form Handling:**')
                lines.extend([
                    '- Server Action integration with `useActionState`',
                    '- Form validation with Zod schemas',
                    '- Client-side error display',
                    ''
                ])
            
            # Notes section
            lines.extend(['## Notes & Context', ''])
            
            if name == 'layout':
                lines.extend([
                    '- Critical wrapper component for entire admin dashboard',
                    '- Imports and renders `Header` and `Sidebar` components',
                    '- Uses Bootstrap grid system (`container-fluid`, `row`)',
                    '- Renders `children` prop for nested routes',
                ])
            elif name == 'loading':
                lines.extend([
                    '- Renders while child routes load data',
                    '- Provides loading feedback to users',
                    '- Can be enhanced with skeleton screens',
                ])
            elif 'page' in name:
                if len(parts) == 1:
                    lines.extend([
                        f'- Main list/dashboard page for {parts[0]} management',
                        '- Typically displays data in DataTable format',
                        '- Provides navigation to create/edit/view operations',
                    ])
                elif 'new' in parts:
                    lines.extend([
                        f'- Allows admins to create new {parts[0]} records',
                        '- Contains form with validation',
                        '- Submits to server action for database storage',
                    ])
                elif 'edit' in parts:
                    lines.extend([
                        f'- Allows editing of existing {parts[0]} records',
                        '- Pre-populates form with current data',
                        '- Submits updates via server action',
                    ])
                elif 'view' in parts:
                    lines.extend([
                        f'- Displays read-only details of {parts[0]} records',
                        '- Shows all relevant fields and information',
                        '- Provides navigation to edit or delete',
                    ])
            elif 'Actions' in name or name.endswith('Actions'):
                lines.extend([
                    '- Contains one or more server actions (`"use server"`)',
                    '- Handles backend logic including database operations',
                    '- Validates and sanitizes user input',
                    '- Manages authentication and authorization',
                    '- Sets redirect paths or toast messages for UI feedback',
                ])
            
            # Write the file
            doc_file.write_text('\n'.join(lines), encoding='utf-8')
            print(f'✓ Updated: {str(doc_file).replace(os.getcwd() + chr(92), "")}')
        
        except Exception as e:
            print(f'✗ Error processing {path}: {str(e)[:100]}')

print('\n✓ Admin documentation generation complete!')
