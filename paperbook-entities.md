```typescript
class UserEntity {
  id: number | string
  createdAt: Date
  updatedAt: Date
  name: string
  lastName: string
  email: string
  password: string
  cpf: string
  roles: 'user' | 'admin' | 'seller'
  phone: string
}
```

```typescript
class CategoryEntity {
  id: number | string
  createdAt: Date
  updatedAt: Date
  name: string
}
```

```typescript
class ProductEntity {
  id: number | string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string
  fullPrice: number
  installmentPrice: number
  installmentAmount: number
  discountAmount: number
  stockAmount: number
  ratingId: number | string

  // relations
  rating: RatingEntity
}
```

```typescript
class ProductCategoryEntity {
  id: number | string
  createdAt: Date
  updatedAt: Date
  productId: number | string
  categoryId: number | string

  // relations
  product: ProductEntity
  category: CategoryEntity
}
```

```typescript
class AddressEntity {
  id: number | string
  createdAt: Date
  updatedAt: Date
  cep: string
  street: string
  houseNumber: number
  complement: string
  district: string
  city: string
  state: string
  userId: number | string

  // relations
  user: UserEntity
}
```

```typescript
class OrderEntity {
  id: number | string
  createdAt: Date
  updatedAt: Date
  status: number
  /**
   * 0 -> confirmed
   * 1 -> pendent
   * 2 -> canceled
   */
  trackingCode: string
  userId: number | string
  productId: number | string

  // relations
  user: UserEntity
  product: ProductEntity
}
```

```typescript
class RatingEntity {
  id: number | string
  createdAt: Date
  updatedAt: Date
  five: number
  four: number
  three: number
  two: number
  one: number
  zero: number
  productId: number | string

  // relations
  product: ProductEntity
}
```

```typescript
class ShoppingCartEntity {
  id: number | string
  createdAt: Date
  updatedAt: Date
  productId: number | string
  userId: number | string

  // relations
  product: ProductEntity
  user: UserEntity
}
```

```typescript
class CommentEntity {
  id: number | string
  createdAt: Date
  updatedAt: Date
  text: string
  like: number
  dislike: number
  userId: number | string
  productId: number | string

  // relations
  user: UserEntity
  product: ProductEntity
}
```
