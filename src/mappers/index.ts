import { KumuElement } from '../kumu'
//import { JSONSchema6 } from 'json-schema'
type SchemaPropertyDef = any

export const mappers:any = {
  string(colName:string) {
    function mapper(elt:KumuElement,schema:SchemaPropertyDef):string {
      return elt[colName]
    }
    return mapper
  },
  url(colName:string) {
    function mapper(elt:KumuElement,schema:SchemaPropertyDef):string {
      return elt[colName]
    }
    return mapper
  },
  tagArray(colName:string) {
    function mapper(elt:KumuElement,schema:SchemaPropertyDef):string {
      return elt[colName]
    }
    return mapper
  },
  default(value:string) {
    function mapper(elt:KumuElement,schema:SchemaPropertyDef):string {
      return value
    }
    return mapper
  },
  workingGroupCategory() {
    function mapper(elt:KumuElement,schema:SchemaPropertyDef):string {

      const conns = elt.findOutboundOfType('organization-for-group')
      const parentOrgName = elt.fields['Parent Org']
      console.log(elt.label.padStart(60,' ')+"\t"+conns.length+"\t"+parentOrgName)
      return 'zork'

      if(conns.length == 0)
        throw new Error("Failed to find working group connection for" + elt.label)
      if(conns.length != 0)
        throw new Error("Too many working group connection for" + elt.label)
      if(!parentOrgName)
        throw new Error("Unparented working group for "+elt.label)

      const parentOrg = elt.model.locateElementByLabel(parentOrgName)
      if(!parentOrg) {
        // throw new Error("Parented working group, but parent not found for elt "+elt.label)
        console.log("Parented working group, but parent not found for elt "+elt.label)
        return 'error'
        }

      console.log("Working Group '"+elt.label+"' is 'w/in a "+parentOrg.fields['SubType']+"' (parent is:"+parentOrg.label+")")
      return 'unknowon'
    }
    return mapper
  }
}
