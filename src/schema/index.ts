
import { schema as event } from './event'
import { schema as workingGroup } from './working-group'
import { schema as person } from './person'
import { schema as organization } from './organization'
import { schema as projectOrProduct } from './project-or-product'
import { schema as publication } from './publication'

// These keys are the 'input spreadsheet' keys
export const schemas = {
  event,
  person,
  'working-group':workingGroup,
  'project-or-product':projectOrProduct,
  organization,
  publication
}

import { inbound as eventMapper } from './event'
import { inbound as workingGroupMapper } from './working-group'
import { inbound as personMapper } from './person'
import { inbound as organizationMapper } from './organization'
import { inbound as projectOrProductMapper } from './project-or-product'
import { inbound as publicationMapper } from './publication'

// These keys are the description field for the schemas above
export const inbound = {
  'Event':eventMapper,
  'Working Group':workingGroupMapper,
  'Person':personMapper,
  'Organization':organizationMapper,
  'Project or Product':projectOrProductMapper,
  'Publication':publicationMapper
}

import { JSONSchema6 } from 'json-schema'

export function buildInboundMapper(schema:JSONSchema6,flavor:string) {
  const result:any = {}
  const inboundMap = inbound[schema.description]
  if(!inboundMap)
    throw new Error("Failed to find inbound mapper map for schema "+schema.description)
  for(let propName in schema.properties) {
    const smap = inboundMap[propName]
    if(!smap)
      throw new Error("Failed to find inbound map for property on schema "+schema.description+", prop="+propName)
    const mapper=smap[flavor]
    if(!mapper)
      throw new Error("Failed to find mapper inbound map for property on schema "+schema.description+", prop="+propName+", flavor="+flavor)
    result[propName] = mapper
  }
  return result
}
