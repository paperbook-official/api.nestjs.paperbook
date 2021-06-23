import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { createConnection, getConnection, getRepository } from 'typeorm'

import { EntityAlreadyDisabledException } from 'src/exceptions/conflict/entity-already-disabled.exception'
import { EntityAlreadyEnabledException } from 'src/exceptions/conflict/entity-already-enabled.exception'
import { EntityNotFoundException } from 'src/exceptions/not-found/entity-not-found.exception'

import { CategoryEntity } from '../entities/category.entity'

import { CategoryService } from './category.service'

describe('CategoryService', () => {
  let service: CategoryService

  beforeAll(async () => {
    await createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: ['src/modules/**/*.entity.ts'],
      synchronize: true,
      logging: false,
    })
  })

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: getRepository(CategoryEntity),
        },
      ],
    }).compile()

    service = await module.resolve(CategoryService)
  })

  // test if the service exists
  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    // tests if the "create" methods is working properly
    it('should create a new category', async () => {
      const entity = await service.create({
        name: 'CREATING-CATEGORY-TEST',
      })

      expect(entity).toBeDefined()
      expect(entity).toMatchObject({ name: 'CREATING-CATEGORY-TEST' })
    })
  })

  describe('listOne', () => {
    // tests if the "listOne" method is throwing an exception when it does not find an entity
    it('should throw an "EntityNotFoundException" when it does not find a category', async () => {
      await expect(service.listOne(0)).rejects.toThrowError(
        EntityNotFoundException,
      )
    })

    // tests if the "listOne" methods is working properly
    it('should list one category', async () => {
      const { id } = await service.create({
        name: 'LISTING-ONE-CATEGORY-TEST',
      })

      const entity = await service.listOne(id)

      expect(entity).toBeDefined()
      expect(entity).toMatchObject({
        id,
        name: 'LISTING-ONE-CATEGORY-TEST',
      })
    })
  })

  describe('update', () => {
    // tests if the "update" method is throwing an exception when it does not find an entity
    it('should throw an "EntityNotFoundException" when it does not find a category', async () => {
      await expect(service.update(0, {})).rejects.toThrowError(
        EntityNotFoundException,
      )
    })

    // tests if the "update" methods is working properly
    it('should update one category', async () => {
      const { id } = await service.create({
        name: 'UPDATE-CATEGORY-TEST-01',
      })

      await service.update(id, {
        name: 'UPDATE-CATEGORY-TEST-02',
      })

      const entity = await service.listOne(id)

      expect(entity).toBeDefined()
      expect(entity).toMatchObject({
        id,
        name: 'UPDATE-CATEGORY-TEST-02',
      })
    })
  })

  describe('delete', () => {
    // tests if the "delete" method is throwing an exception when it does not find an entity
    it('should throw an "EntityNotFoundException" when it does not find a category', async () => {
      await expect(service.listOne(0)).rejects.toThrowError(
        EntityNotFoundException,
      )
    })

    // tests if the "delete" methods is working properly
    it('should delete one category', async () => {
      const { id } = await service.create({
        name: 'DELETE-CATEGORY-TEST',
      })

      await service.delete(id)

      expect(service.listOne(id)).rejects.toBeInstanceOf(
        EntityNotFoundException,
      )
    })
  })

  describe('disable', () => {
    // tests if the "disable" method is throwing an exception when it does not find an entity
    it('should throw an "EntityNotFoundException" when it does not find a category', async () => {
      await expect(service.listOne(0)).rejects.toThrowError(
        EntityNotFoundException,
      )
    })

    it('should disable a category', async () => {
      const { id } = await service.create({
        name: 'DISABLE-CATEGORY-TEST',
      })

      await service.disable(id)

      expect(service.listOne(id)).rejects.toBeInstanceOf(
        EntityNotFoundException,
      )
    })

    // tests if the "disable" method is throwing an exception when the entity is already disabled
    it('should throw an "EntityAlreadyDisabledException" when it does not find a category', async () => {
      const { id } = await service.create({
        name: 'ALREADY-DISABLED-CATEGORY-TEST',
      })

      await service.disable(id)

      await expect(service.disable(id)).rejects.toThrowError(
        EntityAlreadyDisabledException,
      )
    })
  })

  describe('enable', () => {
    // tests if the "enable" method is throwing an exception when it does not find an entity
    it('should throw an "EntityNotFoundException" when it does not find a category', async () => {
      await expect(service.listOne(0)).rejects.toThrowError(
        EntityNotFoundException,
      )
    })

    it('should enable a category', async () => {
      const { id } = await service.create({
        name: 'ENABLE-CATEGORY-TEST',
      })

      await service.disable(id)

      expect(service.listOne(id)).rejects.toBeInstanceOf(
        EntityNotFoundException,
      )

      await service.enable(id)

      const entity = await service.listOne(id)

      expect(entity).toBeDefined()
      expect(entity).toMatchObject({
        id,
        name: 'ENABLE-CATEGORY-TEST',
      })
    })

    // tests if the "disable" method is throwing an exception when the entity is already disabled
    it('should throw an "EntityAlreadyEnabled" when it does not find a category', async () => {
      const { id } = await service.create({
        name: 'ALREADY-DISABLED-CATEGORY-TEST',
      })

      await expect(service.enable(id)).rejects.toThrowError(
        EntityAlreadyEnabledException,
      )
    })
  })

  afterAll(async () => {
    await getConnection().close()
  })
})
