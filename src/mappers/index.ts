import { KumuElement } from '../kumu'
//import { JSONSchema6 } from 'json-schema'
type SchemaPropertyDef = any

function getPublicationOrgs(elt:KumuElement) {
  const orgs = {}

  for(let auth of elt.findInboundOfType('author')) {
    if(auth.from.type.name != 'person') {
      orgs[auth.from.label] = auth.from
    }
  }

  for(let c of elt.findOutboundOfType('specification-of-group')) {
    orgs[c.to.label] = c
  }

  let sponsoringOrgName = elt.fields['Parent Org']
  if(sponsoringOrgName) {
    const sponsoringOrg = elt.model.locateElementByLabel(sponsoringOrgName)
    if(sponsoringOrg) {
      orgs[sponsoringOrg.label] = sponsoringOrg
      }
    }

  return orgs
}

export const mappers:any = {
  string(colName:string,dflt:string = '') {
    function mapper(elt:KumuElement,schema:SchemaPropertyDef):string {
      return elt.fields[colName] || dflt
    }
    return mapper
  },
  skip() {
    function mapper(elt:KumuElement,schema:SchemaPropertyDef) {
      return undefined
    }
    return mapper
  },
  description() {
    function mapper(elt:KumuElement,schema:SchemaPropertyDef):string {
      return elt.description
    }
    return mapper
  },
  label() {
    function mapper(elt:KumuElement,schema:SchemaPropertyDef):string {
      return elt.label
    }
    return mapper
  },
  tagArray(colName:string) {
    function mapper(elt:KumuElement,schema:SchemaPropertyDef):string {
      return elt[colName]
    }
    return mapper
  },
  connectionIfExists(relName:string) {
    function mapper(elt:KumuElement,schema:SchemaPropertyDef):string {
      const c = elt.findInboundOfType(relName)
      if(!c || c.length==0)
        return ''
      return c[0].from.label
    }
    return mapper
  },
  publicationAuthors(colName:string) {
    function mapper(elt:KumuElement,schema:SchemaPropertyDef):string {
      const authors = {}

    	for(let auth of elt.findInboundOfType('author')) {
    		if(auth.from.type.name == 'person') {
    			authors[auth.from.label] = auth.from
    		}
    	}

      if(!authors) {
        const orgs = getPublicationOrgs(elt)
        return (Object.keys(authors).sort()).join(";")
      }

    	return (Object.keys(authors).sort()).join(";")
    }
    return mapper
  },
  publicationOrgs(colName:string) {
    function mapper(elt:KumuElement,schema:SchemaPropertyDef):string {
    	const orgs = getPublicationOrgs(elt)

      return (Object.keys(orgs).sort()).join(";")
    }
    return mapper
  },
  default(value:string) {
    function mapper(elt:KumuElement,schema:SchemaPropertyDef):string {
      return value
    }
    return mapper
  }
}
