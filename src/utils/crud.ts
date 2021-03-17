import { GetManyDefaultResponse } from '@nestjsx/crud'

import { ToProxy } from 'src/common/to-proxy'

/**
 * Function that can convert all the entities that were being passed through
 * the "GetManyDefaultResponse" class instance in it respective proxy
 * @param getManyDefaultResponse stores the complete data that is returned
 * from the service class
 * @param params stores the default params that, if exists, will be passed
 * in the "ToProxy" method params parameter
 */
export function mapCrud<TProxy, TEntity extends ToProxy<TProxy>>(
  getManyDefaultResponse: GetManyDefaultResponse<TEntity> | TEntity[],
  ...params: Parameters<TEntity['toProxy']>
): GetManyDefaultResponse<TProxy> | TProxy[] {
  if (Array.isArray(getManyDefaultResponse))
    return getManyDefaultResponse.map(entity => entity.toProxy(...params))

  return {
    ...getManyDefaultResponse,
    data: getManyDefaultResponse.data.map(entity => entity.toProxy(...params))
  }
}
