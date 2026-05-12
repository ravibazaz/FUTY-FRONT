from pathlib import Path
import re

root = Path('app/api')
doc_root = Path('doc/app/api')

for path in sorted(root.rglob('route.js')):
    rel = path.relative_to(root)
    output_path = doc_root / rel.with_suffix(rel.suffix + '.md')
    output_path.parent.mkdir(parents=True, exist_ok=True)
    content = path.read_text(encoding='utf-8')
    method = 'GET' if 'export async function GET' in content else 'POST' if 'export async function POST' in content else 'PUT' if 'export async function PUT' in content else 'DELETE' if 'export async function DELETE' in content else 'UNKNOWN'
    endpoint = '/api/' + '/'.join(rel.parts[:-1])
    if endpoint.endswith('/route.js'):
        endpoint = endpoint[:-len('/route.js')]
    endpoint = endpoint.replace('\\', '/')
    endpoint = endpoint.replace('//', '/')
    endpoint = endpoint.replace('[', '[').replace(']', ']')

    authenticated = 'Yes' if 'protectApiRoute' in content or 'verifyAuth' in content or 'cookies()' in content and 'return NextResponse' not in content else 'No'
    imports = [line.strip() for line in content.splitlines() if line.strip().startswith('import ')]
    query_params = []
    body_fields = []
    example_response = ''
    notes = []

    if 'searchParams' in content:
        if 'q' in content:
            query_params.append('q')
        if 'page' in content:
            query_params.append('page')
        if 'limit' in content:
            query_params.append('limit')
    if method == 'POST' and 'req.json' in content:
        body_fields.append('Request JSON body')
    if 'req.formData' in content:
        body_fields.append('FormData body')
    if 'req.body' in content:
        body_fields.append('Raw body data')
    if 'Response.json' in content or 'NextResponse.json' in content:
        if 'success:' in content:
            example_response = '{\n  "success": true,\n  "message": "...",\n  "data": ...\n}'
        elif 'adverts' in content:
            example_response = '{\n  "adverts": [ ... ]\n}'
        elif 'agegroups' in content:
            example_response = '{\n  "agegroups": [ ... ]\n}'
        elif 'categories' in content and 'subcategories' not in endpoint:
            example_response = '{\n  "categories": [ ... ]\n}'
        elif 'categorywise' in endpoint:
            example_response = '{\n  "success": true,\n  "message": "...",\n  "data": [ ... ]\n}'
        else:
            example_response = '{\n  "success": true,\n  "message": "...",\n  "data": ...\n}'
    if endpoint == '/api/agegroups/age-groups':
        example_response = '{\n  "agegroupname": { ... }\n}'
    if endpoint == '/api/categories':
        example_response = '{\n  "categories": [ ... ]\n}'
    if endpoint.endswith('/list'):
        example_response = '{\n  "success": true,\n  "message": "...",\n  "data": [ ... ],\n  "pagination": { ... }\n}'

    purpose = 'Returns API data for the endpoint.'
    if endpoint.endswith('/route.js'):
        purpose = 'Fallback route file for endpoint.'
    if endpoint == '/api/adverts':
        purpose = 'Returns active adverts for public or admin consumption.'
    elif endpoint == '/api/adverts/list':
        purpose = 'Returns adverts matching optional search criteria.'
    elif endpoint == '/api/adverts/list2response':
        purpose = 'Returns a random selection of adverts for Manager or Friendly pages.'
    elif endpoint == '/api/adverts/createorder':
        purpose = 'Creates a new order history record after authentication.'
    elif endpoint == '/api/agegroups':
        purpose = 'Returns all age groups.'
    elif endpoint == '/api/agegroups/age-groups':
        purpose = 'Returns a specific age group name by ID.'
    elif endpoint == '/api/categories':
        purpose = 'Returns active categories with parent details.'
    elif endpoint == '/api/categories/list':
        purpose = 'Returns paginated top-level categories for authenticated users.'
    elif endpoint == '/api/categories/subcategories/[id]':
        purpose = 'Returns subcategories for a parent category after authentication.'
    elif endpoint == '/api/check-email':
        purpose = 'Checks whether an email is already registered.'

    # Build output file content
    lines = [
        f'# {method} {endpoint}',
        '',
        '## Purpose',
        '',
        purpose,
        '',
        '## File Location',
        '',
        f'`{path.as_posix()}`',
        '',
        '## HTTP Method',
        '',
        method,
        '',
        '## Authentication Required',
        '',
        authenticated,
        '',
        '## Behavior',
        '',
    ]

    lines.append('- Connects to the database using `connectDB()` whenever present.')
    if 'protectApiRoute' in content:
        lines.append('- Protects the route with `protectApiRoute(req)` and returns authentication errors.')
    if 'searchParams' in content:
        lines.append('- Parses query parameters from the request URL.')
    if 'req.json' in content:
        lines.append('- Reads JSON request body with `await req.json()`.')
    if 'req.formData' in content:
        lines.append('- Reads form data from the request.')
    if 'Return Response.json' in content or 'NextResponse.json' in content:
        lines.append('- Returns structured JSON response to the client.')
    if 'find(' in content and 'Adverts' in content:
        lines.append('- Reads advert data from the `Adverts` collection.')
    if 'find(' in content and 'AgeGroups' in content:
        lines.append('- Reads age group data from the `AgeGroups` collection.')
    if 'find(' in content and 'Categories' in content:
        lines.append('- Reads category data from the `Categories` collection.')
    if 'findById' in content:
        lines.append('- Looks up a specific document by its ID.')
    if 'aggregate' in content:
        lines.append('- Uses MongoDB aggregation for advanced filtering.')

    lines.extend(['', '## Query Parameters', ''])
    if query_params:
        for qp in query_params:
            lines.append(f'- `{qp}`')
    else:
        lines.append('- None')

    lines.extend(['', '## Request Body', ''])
    if body_fields:
        for bf in body_fields:
            lines.append(f'- {bf}')
    else:
        lines.append('- None')

    lines.extend(['', '## Response Example', '', '```json'])
    lines.append(example_response if example_response else '{\n  "success": true,\n  "message": "...",\n  "data": ...\n}')
    lines.extend(['```', ''])

    if imports:
        lines.extend(['## Imports', ''])
        lines.extend([f'- `{imp}`' for imp in imports])
        lines.append('')

    lines.extend(['## Notes', ''])
    if 'protectApiRoute' in content:
        lines.append('- This endpoint is protected and requires valid authentication.')
    if endpoint.endswith('/list'):
        lines.append('- Supports pagination and optional search filters.')
    if endpoint.startswith('/api/uploads'):
        lines.append('- Serves uploaded files based on filename parameters.')
    if endpoint == '/api/agegroups/age-groups':
        lines.append('- Returns only the `age_group` field for the requested ID.')
    if endpoint == '/api/categories':
        lines.append('- Populates parent category metadata using `populate("parent_cat_id")`.')
    if endpoint == '/api/categories/subcategories/[id]':
        lines.append('- Uses the path `id` as `parent_cat_id` to return child categories.')

    output_path.write_text('\n'.join(lines), encoding='utf-8')
    print(f'Generated {output_path}')
