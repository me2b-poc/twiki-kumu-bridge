import fs from 'fs-extra'
import slugify from 'slugify';
import uuid from 'uuid'

const kumu_slugify = (x:any):string => {
	return slugify(x,{lower:true})
}
// --------------------------------------------------------------------------
// Declaration

// every connection or element has a guid, which is used internally,
// and is bound to the model (which serves as a factory for the entities)
export interface KumuEntity {
	guid:string
	model:KumuModel
	slugmap:{[key:string]:string}
}

// we are going to add a little bit here to allow use of 'nested' types
export interface KumuTag extends KumuEntity {
	slug:string
	title:string
	elements:KumuElementMap
	connections:KumuConnectionMap
}

// we are going to add a little bit here to allow use of 'nested' types
export interface KumuType {
	name:string
	depth:number
	parts:string[]
}
export interface KumuElementType extends KumuType {
	parent?:KumuElementType
}
export interface KumuConnectionType extends KumuType {
	parent?:KumuConnectionType
}

// now on to the meat of the model
export interface KumuElement extends KumuEntity {
	slug:string
	label:string

	type:KumuElementType
	description:string
	tags:KumuTagMap

	inbound:KumuConnectionMap
	outbound:KumuConnectionMap

	fields:any

	addOutbound:(conn:KumuConnection) => void
	addInbound:(conn:KumuConnection) => void

}

export interface KumuConnection extends KumuEntity {
	from:KumuElement
	to:KumuElement
	type:KumuConnectionType
	fields:any
	description:string
}

// utility maps
export type KumuTagMap = {[id:string]:KumuTag}
export type KumuElementMap = {[id:string]:KumuElement}
export type KumuConnectionMap = {[id:string]:KumuConnection}
export type KumuElementTypeMap = {[id:string]:KumuElementType}
export type KumuConnectionTypeMap = {[id:string]:KumuConnectionType}



// --------------------------------------------------------------------------
// Implementation


export class SimpleKumuEntity implements KumuEntity {
	guid:string
	model:KumuModel
	slugmap:{[key:string]:string}

	constructor(src:any,model:KumuModel) {
		this.guid = uuid.v4()
		this.model = model
		this.slugmap = {}
		for (let key in src ) {
			const s = kumu_slugify(key)
			const val = ''+src[key]
			this.slugmap[s] = val
		}
	}

	mapFieldsExcept(elt:any,exclusion:string[]):Map<string,string> {
		const result = new Map<string,string>()
		const ex = new Set<string>()
		for(let key of exclusion)
			ex.add(kumu_slugify(key))

		for(let key in elt) {
			const slug = kumu_slugify(key)
			if ( ! ex.has(slug) ) {
				const value = elt[key]
				if (value != '')
					result[key] = value
			}
		}

		return result
	}

}


export class SimpleKumuElement extends SimpleKumuEntity implements KumuElement  {

		slug:string
		label:string

		type:KumuElementType
		description:string
		tags:KumuTagMap

		inbound:KumuConnectionMap
		outbound:KumuConnectionMap

		fields:Map<string,string>

    constructor(elt:any,model:KumuModel) {
			super(elt,model)

			this.label=this.slugmap.label || model.next_label()
			this.slug = kumu_slugify(this.label)
			this.type = this.model.encounterElementType(this.slugmap.type)
			this.description = this.slugmap.description || ""
			this.tags = {}
			this.inbound = {}
			this.outbound = {}
			this.fields=this.mapFieldsExcept(elt,['Label','Description','Type'])
			this.model.encounterElement(this)
		}

		addOutbound(conn:KumuConnection) {
			this.outbound[conn.guid] = conn
		}

		addInbound(conn:KumuConnection) {
			this.inbound[conn.guid] = conn
		}
}

export class SimpleKumuConnection extends SimpleKumuEntity implements KumuConnection {

	from:KumuElement
	to:KumuElement

	type:KumuConnectionType
	fields:Map<string,string>
	description:string

	locateFrom(def:any):KumuElement {
		if(!def.From)
			throw "Malformed connection, missing From field on def"
	 	const result = this.model.locateElementByLabel(def.From)
		if(!result)
			throw "Can not find From element"+kumu_slugify(def.From)+" with connection "+JSON.stringify(def)
		return result
	}
	locateTo(def:any):KumuElement {
		if(!def.To)
			throw "Malformed connection, missing To field on def"
		const result = this.model.locateElementByLabel(def.To)
		if(!result)
			throw "Can not find To element"+kumu_slugify(def.To)+" with connection "+JSON.stringify(def)
		return result
	}


  constructor(def:any, model:KumuModel) {
		super(def,model)

		this.type = this.model.encounterConnectionType(this.slugmap.type)
		this.description = this.slugmap.description || ""
		this.fields=this.mapFieldsExcept(def,['Label','Description','Type'])

		this.from = this.locateFrom(def)
		this.from.addOutbound(this)

		this.to = this.locateTo(def)
		this.to.addInbound(this)
  }
}

// --------------------------------------------------------------------------
//

export class SimpleKumuType extends SimpleKumuEntity implements KumuType {
	name:string
	depth:number
	parts:string[]

	constructor(type:string,model:KumuModel) {
		super({},model)

		const p = type.split("/")
		this.depth = p.length
		this.parts =[]
		for(let idx in p)
			this.parts[idx]=kumu_slugify(p[idx])
		this.name = this.parts[this.depth-1]
	}
}

export class SimpleKumuElementType extends SimpleKumuType implements KumuElementType {
	parent?:KumuElementType
	constructor(type:string,model:KumuModel) {
		super(type,model)
		if(this.depth>1) {
			const parentType = this.parts.slice(0,this.depth-1).join("/")
			this.parent = this.model.encounterElementType(parentType);
		}
	}
}
export class SimpleKumuConnectionType extends SimpleKumuType implements KumuConnectionType {
	parent?:KumuConnectionType
	constructor(type:string,model:KumuModel) {
		super(type,model)
		if(this.depth>1) {
			const parentType = this.parts.slice(0,this.depth-1).join("/")
			this.parent = this.model.encounterConnectionType(parentType);
		}
	}
}

// --------------------------------------------------------------------------
export class KumuModel
{
	// handles unlabeled elements
	index:number
	 next_label():string {
		this.index = this.index + 1
		return 'unlabeled-'+this.index
	}

	elements:KumuElementMap
	elementTypes:KumuElementTypeMap
	defaultElementType:KumuElementType
	connectionTypes:KumuConnectionTypeMap
	defaultConnectionType:KumuConnectionType

	constructor() {
		this.index = 0
		this.elements = {}
		this.elementTypes = {}
		this.connectionTypes = {}
		this.defaultConnectionType = this.encounterConnectionType('default')
		this.defaultElementType = this.encounterElementType('default')
	}

	encounterElement(elt:KumuElement) {
		this.elements[elt.slug] = elt
	}

	locateElementByLabel(label:string):KumuElement {
		const result = this.elements[kumu_slugify(label)]
		if(!result) {
			console.log("FAILED TO FIND",label,"=>",kumu_slugify(label))
			for(let x in this.elements)
				console.log(x)
		}
		return result
	}
	encounterElementType(type:string):KumuElementType
	{
		if(!type)
			return this.defaultElementType
		if(!this.elementTypes[type])
			this.elementTypes[type] = new SimpleKumuElementType(type,this)
		return this.elementTypes[type]
	}

	encounterConnectionType(type:string):KumuConnectionType
	{
		if(!type)
			return this.defaultConnectionType
		if(!this.connectionTypes[type])
			this.connectionTypes[type] = new SimpleKumuConnectionType(type,this)
		return this.connectionTypes[type]
	}

}
// --------------------------------------------------------------------------

export async function kumuloader(eltfile:string,connfile:string):Promise<KumuModel> {
	const elts = JSON.parse(await fs.readFile(eltfile))
	const conns = JSON.parse(await fs.readFile(connfile))
	const model = new KumuModel()

	console.log("Building Elements");
	for(let e of elts) {
		new SimpleKumuElement(e,model)
	}

	console.log("Building Connections");
	for(let c of conns) {
		new SimpleKumuConnection(c,model)
	}

	return model
}
