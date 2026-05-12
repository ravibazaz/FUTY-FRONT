from pathlib import Path
import re

root = Path('app/api/adverts')
doc_root = Path('doc/app/api/adverts')

for path in sorted(root.rglob('route.js')):
    rel = path.relative_to(root)
    output_path = doc_root / rel.with_suffix(rel.suffix + '.md')
    output_path.parent.mkdir(parents=True, exist_ok=True)
    content = path.read_text(encoding='utf-8')
    method = 'GET' if 'export async function GET' in content else 'POST' if 'export async function POST' in content else 'UNKNOWN'
    parts = list(rel.parts[:-1])
    if len(parts) == 0:
        endpoint = '/api/adverts'
    else:
        endpoint = '/api/adverts/' + '/'.join(parts)
    
    if '[id]' in endpoint or '[cat_id]' in endpoint:
        endpoint = endpoint.replace('[id]', '[id]').replace('[cat_id]', '[cat_id]')
    
    auth = 'Yes' if 'protectApiRoute' in content else 'No'
    imports = [line for line in content.splitlines() if line.startswith('import ')]
    models = [m.group(1) for m in [re.search(r'import .* from "@/lib/models/(.+?)"', line) or re.search(r'import .* from "@/lib/models/(.+?)";', line) for line in imports] if m]
    middleware = 'protectApiRoute' in content
    query_params = []
    body_fields = []
    response_fields = []
    if 'searchParams' in content:
        query_params.append('q')
    if method == 'POST':
        body_fields.append('product_id')
        body_fields.append('...order data body fields from request JSON')
    if 'Response.json' in content or 'NextResponse.json' in content:
        if 'success:' in content:
            response_fields.append('success')
        if 'message:' in content:
            response_fields.append('message')
        if 'data:' in content:
            response_fields.append('data')
        if 'adverts' in content and method == 'GET' and len(parts)==0:
            response_fields = ['adverts']
    
    if 'Stores' in content and method == 'GET':
        response_fields = ['success', 'message', 'data']
    if path.match('createorder/route.js'):
        response_fields = ['success', 'message']

    example_response = ''
    if endpoint == '/api/adverts':
        example_response = '{\n  "adverts": [ /* active adverts */ ]\n}'
    elif endpoint == '/api/adverts/list':
        example_response = '{\n  "success": true,\n  "message": "Welcome to the Adverts List!",\n  "data": [ /* adverts */ ]\n}'
    elif endpoint == '/api/adverts/list2response':
        example_response = '{\n  "success": true,\n  "message": "Welcome to the Advertisement  List!",\n  "data": [ /* random manager/friendly adverts */ ]\n}'
    elif endpoint == '/api/adverts/createorder':
        example_response = '{\n  "success": true,\n  "message": "Order created successfully!"\n}'
    elif endpoint == '/api/adverts/[id]':
        example_response = '{\n  "success": true,\n  "message": "Welcome to the Product Details!",\n  "data": { /* store data */ }\n}'
    elif endpoint == '/api/adverts/categorywise/[cat_id]':
        example_response = '{\n  "success": true,\n  "message": "Welcome to the Product Details!",\n  "data": [ /* stores matching category */ ]\n}'
    
    lines = [
        f'# {method} {endpoint}',
        '',
        '## Purpose',
        '',
    ]
    if path.match('route.js') and len(parts)==0:
        lines.append('Returns active adverts for the FUTY application.')
    elif endpoint == '/api/adverts/list':
        lines.append('Returns advert documents matching optional search terms.')
    elif endpoint == '/api/adverts/list2response':
        lines.append('Returns a random selection of currently active adverts for Manager and Friendly pages.')
    elif endpoint == '/api/adverts/createorder':
        lines.append('Creates a new order history record for a store product after authentication.')
    elif endpoint == '/api/adverts/[id]':
        lines.append('Returns a single store record by ID after authentication.')
    elif endpoint == '/api/adverts/categorywise/[cat_id]':
        lines.append('Returns store items filtered by category ID and optional search query after authentication.')
    lines.extend(['', '## File', '', f'`{path.as_posix()}`', '', '## HTTP Method', '', method, '', '## Authentication Required', '', auth, '', '## Behavior', ''])
    if endpoint == '/api/adverts':
        lines.extend([
            '- Connects to MongoDB using `connectDB()`.',
            '- Queries `Adverts` collection for `isActive: true`.',
            '- Returns JSON with the matching adverts.',
        ])
    elif endpoint == '/api/adverts/list':
        lines.extend([
            '- Connects to MongoDB using `connectDB()`.',
            '- Reads optional query parameter `q` from the URL.',
            '- Filters adverts by `name` using case-insensitive regex if `q` is provided.',
            '- Selects only the advertised fields: `name`, `image`, `content`, `link`, `date`, `time`, `end_date`, `end_time`, `pages`.',
            '- Returns success message and data array.',
        ])
    elif endpoint == '/api/adverts/list2response':
        lines.extend([
            '- Connects to MongoDB using `connectDB()`.',
            '- Uses aggregation to match adverts where `pages` includes `Manager` or `Friendly`.',
            '- Filters adverts by current date between `startAt` and `endAt`.',
            '- Samples 2 random adverts.',
            '- Projects a limited set of fields.',
            '- Returns success message and data array.',
        ])
    elif endpoint == '/api/adverts/createorder':
        lines.extend([
            '- Protects the route with `protectApiRoute(req)`.',
            '- Reads authenticated `user` from middleware result.',
            '- Parses JSON body from the request.',
            '- Finds the store product using `Stores.findById(product_id)`.',
            '- Copies the existing store image file to a new timestamped filename.',
            '- Creates an `OrderHistories` document with order details and store metadata.',
            '- Returns a success message.',
        ])
    elif endpoint == '/api/adverts/[id]':
        lines.extend([
            '- Protects the route with `protectApiRoute(req)`.',
            '- Reads the path parameter `id`.',
            '- Connects to MongoDB using `connectDB()`.',
            '- Queries `Stores.findById(id)` excluding `__v`.',
            '- Returns store details in the response data.',
        ])
    elif endpoint == '/api/adverts/categorywise/[cat_id]':
        lines.extend([
            '- Protects the route with `protectApiRoute(req)`.',
            '- Reads authenticated `user` from middleware result.',
            '- Reads path parameter `cat_id` and optional query param `q`.',
            '- Connects to MongoDB using `connectDB()`.',
            '- Filters `Stores` by `category` and by `title` regex when `q` is present.',
            '- Returns matching store records with limited fields.',
        ])
    
    lines.extend(['', '## Request', ''])
    if method == 'GET':
        lines.append('- No request body.')
        if query_params:
            lines.append('- Optional query parameters:')
            for qp in query_params:
                lines.append(f'  - `{qp}`')
    else:
        lines.append('- JSON request body expected.')
        if body_fields:
            lines.append('- Example required fields:')
            for bf in body_fields:
                lines.append(f'  - `{bf}`')
    lines.extend(['', '## Response Example', '', '```json', example_response, '```', '', '## Implementation Notes', ''])
    if imports:
        for imp in imports:
            lines.append(f'- `{imp}`')
    if endpoint == '/api/adverts/categorywise/[cat_id]':
        lines.append('- Uses `Stores` collection, not `Adverts`, despite the adverts path.')
    if endpoint == '/api/adverts/[id]':
        lines.append('- Uses `Stores` collection, not `Adverts`, for the requested ID.')
    if endpoint == '/api/adverts/createorder':
        lines.append('- Copies store image files and stores order history metadata.')
    lines.extend(['', '## Notes', ''])
    if endpoint == '/api/adverts':
        lines.append('- This is the public adverts endpoint for active adverts.')
        lines.append('- It is used by the admin adverts listing and public advert consumption.')
    if endpoint == '/api/adverts/list':
        lines.append('- This endpoint returns advert details suitable for list views.')
    if endpoint == '/api/adverts/list2response':
        lines.append('- Designed to provide a small random selection of active Manager/Friendly adverts.')
    if endpoint == '/api/adverts/createorder':
        lines.append('- Requires authentication and user context.')
        lines.append('- Returns simple success JSON only.')
    if endpoint in ['/api/adverts/[id]', '/api/adverts/categorywise/[cat_id]']:
        lines.append('- Protected route requiring valid auth token/cookie.')
        lines.append('- Useful for authenticated store detail and category filters.')

    output_path.write_text('\n'.join(lines), encoding='utf-8')
    print(f'Generated {output_path}')
