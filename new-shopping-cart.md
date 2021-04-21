```typescript
class User {
  public id: number
  public createdAt: Date
  public updatedAt: Date
  public isActive: boolean
  public name: string
  public lastName: string
  public email: string
  public password: string
  public cpf?: string
  public roles: RolesEnum
  public phone?: string
  public shoppingCartId: number

  // relations
  public shoppingCart?: ShoppingCartEntity
  public addresses?: AddressEntity[]
  public orders?: OrderEntity[]
  public products?: ProductEntity[]
  public ratings?: RatingEntity[]
}
```

```typescript
class ShoppingCartEntity {
  public id: number
  public createdAt: Date
  public updatedAt: Date
  public isActive: boolean
  public userId: number

  // relations
  public user?: UserEntity
  public productGroups?: ProductGroupEntity[]
}
```

```typescript
class ProductGroupEntity {
  public id: number
  public createdAt: Date
  public updatedAt: Date
  public isActive: boolean
  public amount: number
  public shoppingCartId: number

  // relations
  public product?: ProductEntity
  public shoppingCart?: ShoppingCartEntity
}
```
