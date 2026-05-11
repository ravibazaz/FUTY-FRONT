# Categories Model Documentation

## Model Purpose

The `Categories` model represents product categories in the FUTY application. It stores category information, hierarchical relationships (parent/child categories), and supports the organization of products in the store. Categories can have parent categories for multi-level categorization.

**Key Responsibility:** Store category hierarchy and organization for product catalog management.

---

## Model Overview

| Aspect | Details |
|--------|---------|
| **File Location** | `lib/models/Categories.js` |
| **Collection Name** | `categories` |
| **Type** | Mongoose Schema Model |
| **Relationships** | Self-referencing (parent categories), Stores (products) |
| **Special Features** | Hierarchical categorization, self-referencing relationships |

---

## Schema Definition

### Core Category Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `String` | No | Category name/title |
| `isActive` | `Boolean` | No | Category active status (default: true) |

### Content & Media

| Field | Type | Description |
|-------|------|-------------|
| `content` | `String` | Category description |
| `image` | `String` | Category image/banner URL |

### Hierarchical Relationships

| Field | Type | Reference | Description |
|-------|------|-----------|-------------|
| `parent_cat_id` | `ObjectId` | `Categories` | Parent category (self-reference, default: null) |

### Metadata

| Field | Type | Description |
|-------|------|-------------|
| `createdAt` | `Date` | Category creation timestamp (default: now) |

---

## Indexes

### Defined Indexes

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| **Default** | `_id` | Primary | Document identification |

### Recommended Additional Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| **Parent Lookup** | `parent_cat_id` | Find child categories |
| **Active Categories** | `isActive` | Active category queries |
| **Title Search** | `title` | Category name lookup |

---

## Usage Examples

### Example 1: Category Creation
```javascript
import Category from '@/lib/models/Categories';

export async function createCategory(categoryData) {
  const category = new Category({
    title: categoryData.name,
    content: categoryData.description,
    image: categoryData.imageUrl,
    parent_cat_id: categoryData.parentId || null,
    isActive: true
  });

  return await category.save();
}
```

### Example 2: Category Hierarchy
```javascript
export async function getCategoryHierarchy() {
  // Get all top-level categories
  const topLevelCategories = await Category.find({
    parent_cat_id: null,
    isActive: true
  }).sort({ title: 1 });

  // For each top-level category, get its children
  const categoriesWithChildren = await Promise.all(
    topLevelCategories.map(async (category) => {
      const children = await Category.find({
        parent_cat_id: category._id,
        isActive: true
      }).sort({ title: 1 });

      return {
        ...category.toObject(),
        children
      };
    })
  );

  return categoriesWithChildren;
}
```

### Example 3: Category Products
```javascript
export async function getCategoryProducts(categoryId) {
  // Get the category
  const category = await Category.findById(categoryId);

  // Get all products in this category
  const products = await Store.find({
    category: categoryId,
    isActive: true
  })
  .populate('user', 'name')
  .select('title price discount image')
  .sort({ title: 1 });

  // Get child categories and their products
  const childCategories = await Category.find({
    parent_cat_id: categoryId,
    isActive: true
  });

  const childProducts = await Promise.all(
    childCategories.map(async (child) => {
      const childProds = await Store.find({
        category: child._id,
        isActive: true
      }).select('title price');

      return {
        category: child.title,
        products: childProds
      };
    })
  );

  return {
    category: category.title,
    products,
    subcategories: childProducts
  };
}
```

### Example 4: Breadcrumb Navigation
```javascript
export async function getCategoryBreadcrumb(categoryId) {
  const breadcrumb = [];
  let currentCategory = await Category.findById(categoryId);

  while (currentCategory) {
    breadcrumb.unshift({
      id: currentCategory._id,
      title: currentCategory.title
    });

    if (currentCategory.parent_cat_id) {
      currentCategory = await Category.findById(currentCategory.parent_cat_id);
    } else {
      currentCategory = null;
    }
  }

  return breadcrumb;
}
```

### Example 5: Category Tree
```javascript
export async function buildCategoryTree() {
  const categories = await Category.find({ isActive: true })
    .sort({ title: 1 });

  const categoryMap = {};
  const roots = [];

  // Create a map for quick lookup
  categories.forEach(cat => {
    categoryMap[cat._id] = { ...cat.toObject(), children: [] };
  });

  // Build the tree
  categories.forEach(cat => {
    if (cat.parent_cat_id) {
      // Has parent, add to parent's children
      if (categoryMap[cat.parent_cat_id]) {
        categoryMap[cat.parent_cat_id].children.push(categoryMap[cat._id]);
      }
    } else {
      // No parent, add to roots
      roots.push(categoryMap[cat._id]);
    }
  });

  return roots;
}
```

### Example 6: Category Statistics
```javascript
export async function getCategoryStats(categoryId) {
  const category = await Category.findById(categoryId);

  // Count direct products
  const directProducts = await Store.countDocuments({
    category: categoryId,
    isActive: true
  });

  // Count products in child categories
  const childCategories = await Category.find({
    parent_cat_id: categoryId,
    isActive: true
  });

  const childCategoryIds = childCategories.map(cat => cat._id);
  const childProducts = await Store.countDocuments({
    category: { $in: childCategoryIds },
    isActive: true
  });

  // Get child category count
  const childCategoryCount = childCategories.length;

  return {
    category: category.title,
    directProducts,
    childProducts,
    totalProducts: directProducts + childProducts,
    childCategories: childCategoryCount
  };
}
```

---

## Relationships & Population

### Population Paths

| Path | Model | Fields | Use Case |
|------|-------|--------|----------|
| `parent_cat_id` | `Categories` | All category fields | Get parent category details |

### Reverse Population Example
```javascript
export async function getCategoryWithParent(categoryId) {
  return await Category.findById(categoryId)
    .populate('parent_cat_id', 'title image');
}
```

---

## Validations

| Validation | Implementation | Error Handling |
|-----------|----------------|----------------|
| **ObjectId Format** | Mongoose ObjectId validation | Cast errors |
| **Boolean Defaults** | Default `isActive: true` | Automatic value assignment |
| **Null Parent** | Default `parent_cat_id: null` | Automatic value assignment |

---

## Business Rules

### 1. **Hierarchical Structure**
- **Rule:** Categories can have parent categories for multi-level organization
- **Self-Reference:** Parent category references the same Categories collection
- **Root Categories:** Categories with no parent are top-level

### 2. **Category Activation**
- **Rule:** Categories can be active or inactive
- **Inheritance:** Child categories should respect parent activation status
- **Impact:** Inactive categories don't appear in navigation

### 3. **Breadcrumb Navigation**
- **Rule:** Categories support breadcrumb navigation through parent relationships
- **Traversal:** Follow parent chain to build navigation path
- **UX:** Enable users to understand category hierarchy

### 4. **Product Organization**
- **Rule:** Categories organize products in the store
- **Relationship:** Products reference categories
- **Navigation:** Category-based product browsing

### 5. **Tree Structure**
- **Rule:** Categories form a tree structure with root and child nodes
- **Algorithms:** Support for tree traversal and hierarchy building
- **Performance:** Efficient category navigation

---

## Performance Considerations

| Aspect | Current State | Recommendation |
|--------|---------------|----------------|
| **Hierarchy Queries** | Recursive parent lookups | Consider caching category trees |
| **Tree Building** | Multiple database queries | Implement tree caching or denormalization |
| **Product Counts** | Separate count queries | Cache category statistics |
| **Breadcrumb Generation** | Sequential parent queries | Cache breadcrumb paths |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Current | Initial categories model with hierarchical relationships |

---

## Future Enhancements

- [ ] Add category sorting/ordering
- [ ] Implement category SEO fields (meta description, keywords)
- [ ] Add category icons and color coding
- [ ] Support for category-specific attributes
- [ ] Add category analytics and usage tracking
- [ ] Implement category permissions and access control
- [ ] Add category templates and layouts
- [ ] Support for category translations/localization
- [ ] Add category archiving and history

---

## Related Models

- `@/lib/models/Stores.js` - Products in categories
- `@/lib/models/Categories.js` - Self-referencing parent categories

---

## Support & Maintenance

For questions or issues related to this model, please refer to the main project documentation or contact the development team.
