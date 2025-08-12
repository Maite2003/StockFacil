# StockFacil - Database Schema Design

## Design Decisions

### Multi-Tenant Architecture

**Decision**: Implement multi-tenant architecture where each user has isolated data

## Benefits of Multi-Tenant Architecture

✅ **Complete Data Isolation**: Each user's data is completely separate
✅ **Scalable**: Can handle thousands of users
✅ **Secure**: Cross-user data access prevented at database level

### Separate Tables with Same Fields Structure

**Decision**: Create separate `customers` and `suppliers` tables with identical structure

**Rationale**:
- Clear separation of responsibilities
- Easy identification of contact role
- Allows different business logic in the future
- Same fields because they represent the same type of information

## Benefits of Separate Tables

✅ **Clarity**: Immediately know if it's a customer or supplier  
✅ **Scalability**: Can add specific fields to each table later  
✅ **Security**: Different permissions for each table  
✅ **Business Logic**: Different validations/rules if needed

### User Schema

```javascript
{
  id: Integer (Primary Key, Auto-increment)
  username: String (Required, Unique)
  email: String (Required, Unique)
  password_hash: String (Required)
  first_name: String (Required)
  last_name: String (Required)
  business_name: String (Optional)
  is_active: Boolean (Default: true)
  email_verified: Boolean (Default: false)
  created_at: DateTime (Auto)
  updated_at: DateTime (Auto)
}
```

### Customers Schema

```javascript
{
  id: Integer (Primary Key, Auto-increment)
  user_id: Integer (Foreign Key -> users.id, Required)
  first_name: String (Required)
  last_name: String (Required)  
  company: String (Optional)
  phone: String (Optional)
  email: String (Required, Unique)
  createdAt: DateTime (Auto)
  updatedAt: DateTime (Auto)

  // Unique constraint per user
  UNIQUE(user_id, email)

}
```

### Suppliers Schema

```javascript
{
  id: Integer (Primary Key, Auto-increment)
  user_id: Integer (Foreign Key -> users.id, Required)
  first_name: String (Required)
  last_name: String (Required)  
  company: String (Optional)
  phone: String (Optional)
  email: String (Required, Unique)
  createdAt: DateTime (Auto)
  updatedAt: DateTime (Auto)

  // Unique constraint per user
  UNIQUE(user_id, email)

}
```

## Products Schema with Categories and Variants

### Categories Schema (Self-Referencing)

**Decision**: Use a self-referencing table for flexible category hierarchy

```javascript
{
  id: Integer (Primary Key)
  user_id: Integer (Foreign Key -> users.id, Required)
  name: String (Required)
  description: String (Optional)
  parent_id: Integer (Foreign Key -> categories.id, Optional)
  level: Integer (0=root, 1=subcategory, etc.)
  createdAt: DateTime (Auto)
  updatedAt: DateTime

  // Ensure parent belongs to same user
  CONSTRAINT parent_same_user CHECK (
    parent_id IS NULL OR 
    parent_id IN (SELECT id FROM categories WHERE user_id = NEW.user_id)
  )

}
```

**Example Data:**
```
id=1, name="Beer Supplies", parent_id=null, level=0
id=2, name="Hops", parent_id=1, level=1  
id=3, name="American Hops", parent_id=2, level=2
id=4, name="Malts", parent_id=1, level=1
```

### Products Schema

**Decision**: Keep track of stock only in the variants and create a default variant if the product doesn't have one to keep track of the stock

```javascript
{
  id: Integer (Primary Key)
  user_id: Integer (Foreign Key -> users.id, Required)
  name: String (Required)
  description: String (Optional)
  selling_price: Decimal (Required) // precio de venta
  category_id: Integer (Foreign Key -> categories.id)
  has_variants: Boolean (Default: false)
  createdAt: DateTime (Auto)
  updatedAt: DateTime (Auto)
  
  // Ensure product belongs to same user
  CONSTRAINT product_same_user CHECK (
    product_id IN (SELECT id FROM products WHERE user_id = NEW.user_id)
  )

}
```

### Product_Variants Schema

```javascript
{
  id: Integer (Primary Key)
  user_id: Integer (Foreign Key -> users.id, Required)
  product_id: Integer (Foreign Key -> products.id)
  variant_name: String (Required)
  selling_price_modifier: Decimal (Default: 0) // +/- sobre selling_price
  stock: Integer (Required)
  // Stock alerts per variant
  min_stock_alert: Integer (Optional) // null = usa el del producto padre
  enable_stock_alerts: Boolean (Default: true)
  createdAt: DateTime (Auto)
  updatedAt: DateTime (Auto)

  // Ensure all entities belong to same user
  CONSTRAINT same_user_check CHECK (
    variant_id IN (SELECT id FROM product_variants WHERE user_id = NEW.user_id) AND
    supplier_id IN (SELECT id FROM suppliers WHERE user_id = NEW.user_id)
  )

}
```

### Variant_Suppliers Schema (For Variant-Specific Suppliers)

**Decision**: Even variants can have different suppliers and purchase prices

```javascript
{
  id: Integer (Primary Key)
  user_id: Integer (Foreign Key -> users.id, Required)
  variant_id: Integer (Foreign Key -> product_variants.id)
  supplier_id: Integer (Foreign Key -> suppliers.id)
  purchase_price: Decimal (Required)
  is_primary_supplier: Boolean (Default: false)
  createdAt: DateTime (Auto)
  updatedAt: DateTime (Auto)
}
```

## Resolved Decisions

✅ **Categories**: Self-referencing table for flexible hierarchy  
✅ **Product Variants**: Separate table with price modifiers and independent stock  
✅ **Multiple Suppliers**: Many-to-many relationship with purchase prices  
✅ **Dual Pricing**: Separate purchase_price and selling_price tracking  
✅ **Stock Alerts**: Customizable per product/variant with enable/disable option  
✅ **Primary Supplier**: Flag to identify main supplier per product

---